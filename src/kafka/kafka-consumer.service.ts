import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-consumer',
      brokers: ['localhost:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-consumer-group' });
  }

  async onModuleInit() {
    // Connect to Kafka asynchronously without blocking app startup
    this.connectWithRetry().catch((error) => {
      console.warn('Kafka consumer connection failed, will retry in background:', error.message);
    });
  }

  private async connectWithRetry(retries = 3, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        await Promise.race([
          this.consumer.connect(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          )
        ]);
        this.isConnected = true;
        console.log('Kafka consumer connected successfully');
        return;
      } catch (error) {
        if (i === retries - 1) {
          console.error('Kafka consumer connection failed after retries:', error);
          this.isConnected = false;
          throw error;
        }
        console.log(`Kafka consumer connection attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      try {
        await this.consumer.disconnect();
        this.isConnected = false;
      } catch (error) {
        console.error('Error disconnecting Kafka consumer:', error);
      }
    }
  }

  async subscribe(topic: string, callback: (message: unknown) => void) {
    // Wait for connection if not yet connected
    if (!this.isConnected) {
      let attempts = 0;
      while (!this.isConnected && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      if (!this.isConnected) {
        throw new Error('Kafka consumer not connected, cannot subscribe');
      }
    }

    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const value = message.value?.toString();
          if (value) {
            const parsedMessage = JSON.parse(value) as unknown;
            console.log(`Received message from topic ${topic}:`, parsedMessage);
            callback(parsedMessage);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
}
