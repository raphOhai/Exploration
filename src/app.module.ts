import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ShoppersService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KafkaModule } from './kafka/kafka.module';
import { StrigaModule } from './striga/striga.module';
import { User } from './users/entities/user.entity';
import { Card } from './users/entities/card.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
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
    AuthModule,
    KafkaModule,
    StrigaModule,
  ],
  controllers: [AppController],
  providers: [ShoppersService],
})
export class AppModule {}
