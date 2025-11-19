import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';

@Injectable()
export class KafkaEventConsumerService implements OnModuleInit {
  private readonly USER_CREATED_TOPIC = 'user-created';

  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  async onModuleInit() {
    // Subscribe to user-created topic
    await this.kafkaConsumer.subscribe(
      this.USER_CREATED_TOPIC,
      this.handleUserCreated.bind(this),
    );
  }

  private handleUserCreated(message: unknown) {
    console.log('User created event received:', message);
    // Add your business logic here
    // e.g., send welcome email, update analytics, etc.
  }
}
