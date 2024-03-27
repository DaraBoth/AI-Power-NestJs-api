import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
import { AIService } from "src/ai/ai.service";
import { Telegraf } from "telegraf";

@Injectable()
export class DarabothService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private AIService: AIService
  ) {}

  private chatID = {
    sominea: 730292307,
    log: -4126147861,
  };
  private botDaraboth: Telegraf;

  async onModuleInit() {
    const token = this.configService.get("TELEGRAM_BOT_TOKEN2");
    this.botDaraboth = new Telegraf(token);
  }

  async sendMessage(chatId: number, message: string) {
    try {
      await this.botDaraboth.telegram.sendMessage(chatId, message);
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
      const chatId: number = message.chat.id;
      console.log("Chat ID = ", chatId);
      console.log("Text = ", message.text);

      // is personal chat
      if (chatId > 0) {
        await this.ResponseWithAI(chatId, message);
      } else {
        // is group chat
        if ((message.text + "").startsWith("/")) {
          if ((message.text + "").includes("/ask")) {
            await this.ResponseWithAI(chatId, {
              ...message,
              text: (message.text + "").replaceAll("/ask", " ").trim(),
            });
          } else {
            // await this.sendMessage(
            //   chatId,
            //   "Sorry I don't know that command.🙄"
            // );
          }
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      // Handle error gracefully
    }
  }

  private async ResponseWithAI(chatId: any, message: any) {
    const prompt = `
    Personal info
    Fullname Vong Pichdaraboth. Name Daraboth.
    Role Personal-AI bot made by Daraboth.
    
    There are message from ${message.from.first_name} ${message.from.last_name} please response to this message : ${message.text}
    `;
    const resMsg = await this.AIService.generateResponse(prompt);
    console.log("Reply = ", resMsg);
    await this.sendMessage(chatId, resMsg);
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
  }
}
