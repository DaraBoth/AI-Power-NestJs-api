import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { AIService } from "src/ai/ai.service";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private AIService: AIService
  ) {}

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
      let resMsg: string;
      switch (chatId) {
        case 730292307: // NeaNea
          const promt = `
           Scenario:
           Sominea (the user) has been dating with Daraboth for a while. Since March 01 2024 until ${new Date()}.
           Objective:
           Craft a heartwarming response from Daraboth that:
           Random Greets Sominea warmly shortly.
           Note:
           Make it short and meaning full.
           Here is Sominea message:
           ${text}
           `;
          resMsg = await this.AIService.generateResponse(promt);
          await this.sendMessage(chatId, resMsg);
          break;
        default:
          resMsg = await this.AIService.generateResponse(text);
          await this.sendMessage(chatId, resMsg);
      }
      if (chatId != "-4126147861") {
        console.log(chatId);
        const alertMessage = `${message.from.first_name} ${message.from.last_name} 
          Message  : ${message.text}
          Response : ${resMsg}`;
        console.log(alertMessage);
        await this.sendMessage(-4126147861, alertMessage);
      }
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

  @Cron("0 6 * * *")
  async sendAutomationMessage6am() {
    const chatID = {
      sominea: 730292307,
    };
    const promt = `
    Write a sweet good morning text to Sonimea (the user) from Daraboth (her sweet boyfriend)
    don't make it long just make it sweet and motivate her for a good new day. Make a cute nickname and call her that.
    `
    const resMsg = await this.AIService.generateResponse(promt);
    await this.sendMessage(chatID.sominea, resMsg);
  }

  @Cron("0 0 * * *")
  async sendAutomationMessage12am() {
    const chatID = {
      sominea: 730292307,
    };
    const promt = `
    Write a sweet goodnight text to Sonimea (the user) from Daraboth (her sweet boyfriend)
    don't make it long just make it sweet and told her how much you love her call her babe or Cupcake.
    `
    const resMsg = await this.AIService.generateResponse(promt);
    await this.sendMessage(chatID.sominea, resMsg);
  }
}
