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
  ) { }

  async onModuleInit() {
    // Create topic if it doesn't exist
    await this.kafkaProducer.createTopicIfNotExists(this.USER_CREATED_TOPIC);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async create(data: Partial<User>) {



    const existingUser = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existingUser) {
      return { message: 'User already exists', data };
    }

    const user = this.usersRepo.create(data);
    const savedUser = await this.usersRepo.save(user);

    // Send message to Kafka topic
    await this.kafkaProducer.sendMessage(this.USER_CREATED_TOPIC, {
      event: 'user.created',
      userId: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      timestamp: new Date().toISOString(),
    });

    return savedUser;
  }

  async sendMessage(topic: string, message: unknown) {
    return this.kafkaProducer.sendMessage(topic, message);
  }
}
