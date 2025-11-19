import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { User } from './entities/user.entity';
import { Card } from './entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Card]),
    KafkaModule,
    AuthModule, // Import AuthModule to access JwtService
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthMiddleware],
  exports: [UsersService, TypeOrmModule], // Export TypeOrmModule for middleware
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
