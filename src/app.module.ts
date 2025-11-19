import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ShoppersService } from './app.service';
import { UsersModule } from './users/users.module';
import { KafkaModule } from './kafka/kafka.module';
import { User } from './users/entities/user.entity';
import { Card } from './users/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydb',
      entities: [User, Card],
      synchronize: true, // dev only
    }),
    UsersModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [ShoppersService],
})
export class AppModule {}
