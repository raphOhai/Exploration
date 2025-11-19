import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-producer',
      brokers: ['localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: unknown) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`Message sent to topic ${topic}:`, message);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }

  async createTopicIfNotExists(topic: string, numPartitions = 1) {
    const admin = this.kafka.admin();
    await admin.connect();

    try {
      const topics = await admin.listTopics();
      if (!topics.includes(topic)) {
        await admin.createTopics({
          topics: [
            {
              topic,
              numPartitions,
            },
          ],
        });
        console.log(`Topic ${topic} created successfully`);
      } else {
        console.log(`Topic ${topic} already exists`);
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    } finally {
      await admin.disconnect();
    }
  }
}
