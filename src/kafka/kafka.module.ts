import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaEventConsumerService } from './kafka-event-consumer.service';

@Module({
  providers: [
    KafkaProducerService,
    KafkaConsumerService,
    KafkaEventConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
