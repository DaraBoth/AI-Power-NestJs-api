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

  private chatID = {
    sominea: 730292307,
    log: -4126147861,
  };

  private babeBirthday = new Date("2024-03-27T00:00:00"); // bd babe at 12am

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
        case this.chatID.sominea: // NeaNea
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
      if (chatId != this.chatID.log) {
        console.log(chatId);
        const alertMessage = `${message.from.first_name} ${message.from.last_name} 
          Message  : ${message.text}
          Response : ${resMsg}`;
        console.log(alertMessage);
        await this.sendMessage(this.chatID.log, alertMessage);
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

  @Cron("* * * * * *")
  async everySecond() {
    const now = new Date();
    now.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });

    // 6am in the morning
    if (
      now.getHours() === 6 &&
      now.getMinutes() === 0 &&
      now.getSeconds() === 0
    ) {
      console.log("Sending good morning text");
      const promt = `
      Write a sweet good morning text to Sonimea (the user) from Daraboth (her sweet boyfriend)
      don't make it long just make it sweet and motivate her for a good new day. Make a cute nickname and call her that.
      `;
      const resMsg = await this.AIService.generateResponse(promt);
      await this.sendMessage(this.chatID.sominea, resMsg);
      await this.sendMessage(this.chatID.log, resMsg);
    }
    // 12am at mid night
    if (
      now.getHours() === 0 &&
      now.getMinutes() === 0 &&
      now.getSeconds() === 0
    ) {
      console.log("Sending good night text");
      const promt = `
      Write a sweet goodnight text to Sonimea (the user) from Daraboth (her sweet boyfriend)
      don't make it long just make it sweet and told her how much you love her call her babe or Cupcake.
      `;
      const resMsg = await this.AIService.generateResponse(promt);
      await this.sendMessage(this.chatID.sominea, resMsg);
      await this.sendMessage(this.chatID.log, resMsg);
    }
    if (
      // BD babe Day 27 , Month 03
      now.getMonth() === this.babeBirthday.getMonth() &&
      now.getDate() === this.babeBirthday.getDate() &&
      now.getHours() === this.babeBirthday.getHours() &&
      now.getMinutes() === this.babeBirthday.getMinutes()
    ) {
      const promt = `
      Compose a heartfelt birthday wish for your girlfriend, assuming the role of her loving boyfriend. Craft a message that expresses your deep affection, admiration, and appreciation for her on this special day. Include personalized details and endearing terms of endearment to make the wish feel intimate and sincere. Ensure the message radiates warmth, tenderness, and genuine emotion..

      My name Daraboth (her boyfriend)
      Her name Sominea (the user)
      Note : 
      - Make it look formal and 
      - Make sure it look nothing like email.
      - Not too long to read short and meaningful
      - Make it sound sweet 
      - Add some wishes
      - Max words 120
      - add some emoji (doesn't count in words)`;
      const resMsg = await this.AIService.generateResponse(promt);
      await this.sendMessage(this.chatID.sominea, resMsg);
      await this.sendMessage(this.chatID.log, resMsg);
    }
  }
}
