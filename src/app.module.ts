import { Module } from "@nestjs/common";
import { BotsModule } from "./telegrambots/bots.module";
import { AIModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobsModule } from './cronjobs/cronjobs.module';
import { TelegramService } from './telegram/telegram.service';
import { TelegramController } from './telegram/telegram.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    BotsModule,
    AIModule,
    CronjobsModule,
  ],
  providers: [TelegramService],
  controllers: [TelegramController],
})
export class AppModule {}
