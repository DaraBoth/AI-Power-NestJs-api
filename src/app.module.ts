import { Module } from "@nestjs/common";
import { BotsModule } from "./telegrambots/bots.module";
import { AIModule } from "./ai/ai.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    BotsModule,
    AIModule,
  ],
})
export class AppModule {}
