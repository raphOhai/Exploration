import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';

@Injectable()
export class KafkaEventConsumerService implements OnModuleInit {
  private readonly USER_CREATED_TOPIC = 'user-created';

  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  async onModuleInit() {
    // Subscribe to user-created topic asynchronously without blocking app startup
    this.subscribeWithRetry().catch((error) => {
      console.warn('Kafka event subscription failed, will retry in background:', error.message);
    });
  }

  private async subscribeWithRetry(retries = 3, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        // Wait a bit for consumer to connect first
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.kafkaConsumer.subscribe(
          this.USER_CREATED_TOPIC,
          this.handleUserCreated.bind(this),
        );
        console.log(`Subscribed to ${this.USER_CREATED_TOPIC} topic successfully`);
        return;
      } catch (error) {
        if (i === retries - 1) {
          console.error('Kafka event subscription failed after retries:', error);
          return; // Don't throw, just log - app should continue without Kafka
        }
        console.log(`Kafka subscription attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private handleUserCreated(message: unknown) {
    console.log('User created event received:', message);
    // Add your business logic here
    // e.g., send welcome email, update analytics, etc.
  }
}
