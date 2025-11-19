import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StrigaService } from './striga.service';

@Module({
  imports: [ConfigModule],
  providers: [StrigaService],
  exports: [StrigaService],
})
export class StrigaModule {}
