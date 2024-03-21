import { Module } from '@nestjs/common';
import { BotController } from './bots.controller';
import { BotsService } from './bots.service';

@Module({
  controllers: [BotController],
  providers: [BotsService],
})
export class BotsModule {}
