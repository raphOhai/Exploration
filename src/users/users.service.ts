import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly USER_CREATED_TOPIC = 'user-created';

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async onModuleInit() {
    // Create topic if it doesn't exist
    await this.kafkaProducer.createTopicIfNotExists(this.USER_CREATED_TOPIC);
  }

  findAll() {
    return this.usersRepo.find();
  }


  async sendMessage(topic: string, message: unknown) {
    return this.kafkaProducer.sendMessage(topic, message);
  }
}
