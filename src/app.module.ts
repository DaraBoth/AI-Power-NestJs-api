import { Module } from "@nestjs/common";
import { AIModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CronjobsModule } from "./cronjobs/cronjobs.module";
import { TelegramService } from "./telegram/services/telegram.service";
import { TelegramController } from "./telegram/telegram.controller";
import { AIService } from "./ai/ai.service";
import { DarabothService } from "./telegram/services/daraboth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    ScheduleModule.forRoot(),
    AIModule,
    CronjobsModule,
  ],
  providers: [TelegramService, AIService , DarabothService],
  controllers: [TelegramController],
})
export class AppModule {}
