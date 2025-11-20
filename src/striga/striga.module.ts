import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StrigaService } from './striga.service';
import { StrigaController } from './striga.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [StrigaController],
  providers: [StrigaService],
  exports: [StrigaService],
})
export class StrigaModule {}
