import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private bot: Telegraf;

  async onModuleInit() {
    const token = this.configService.get("TELEGRAM_BOT_TOKEN");
    this.bot = new Telegraf(token);
  }

  async sendMessage(chatId: number, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      // Handle error gracefully, e.g., notify user or retry
    }
  }

  async handleUpdate(update: any) {
    const { message = undefined, callbackQuery = undefined } = update;

    if (message) {
      await this.handleMessage(message);
    } else if (callbackQuery) {
      await this.handleCallbackQuery(callbackQuery);
    } else {
      // Handle other update types if needed
    }
  }

  private async handleMessage(message: any) {
    try {
      const chatId = message.chat.id;
      const text = message.text;

      // Implement your message handling logic here
      await this.sendMessage(chatId, `Hello, you sent: ${text}`);
    } catch (error) {
      console.error("Error handling message:", error);
      // Handle error gracefully
    }
  }

  private async handleCallbackQuery(callbackQuery: any) {
    try {
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data; // Assuming data access is resolved

      // Implement your button click handling logic here
      await this.sendMessage(chatId, `You clicked button: ${data}`);
    } catch (error) {
      console.error("Error handling callback query:", error);
      // Handle error gracefully
    }
  }
}
