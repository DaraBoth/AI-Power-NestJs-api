import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { TelegramService } from "./services/telegram.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SendMessageDto } from "./dto/SendMessageDto";
import { DarabothService } from "./services/daraboth.service";

@Controller("telegram")
@ApiTags("telegram")
export class TelegramController {
  private readonly encryptionKey = "encryption_key";

  constructor(
    private readonly telegramService: TelegramService,
    private readonly darabothService: DarabothService
  ) {}

  @Post("/send-message")
  @ApiBody({
    description: "Send a message to a Telegram chat",
    required: true,
    type: SendMessageDto,
  })
  async sendMessage(@Body() { chatId, message }: SendMessageDto) {
    await this.telegramService.sendMessage(chatId, message);
    return { message: "Success!" };
  }

  @Post("/webhook")
  async handleUpdate(@Body() messageObject: any, @Res() res) {
    try {
      await this.telegramService.handleUpdate(messageObject);
      res.status(200).send("OK"); // Send a successful response to Telegram
    } catch (error) {
      console.error("Error processing Telegram update:", error);
      res.status(500).send("Internal Server Error"); // Handle errors gracefully
    }
  }

  @Post("/daraboth")
  async handleUpdateDaraboth_bot(@Body() messageObject: any, @Res() res) {
    try {
      await this.darabothService.handleUpdate(messageObject);
      res.status(200).send("OK"); // Send a successful response to Telegram
    } catch (error) {
      console.error("Error processing Telegram update:", error);
      res.status(500).send("Internal Server Error"); // Handle errors gracefully
    }
  }

  @Get("/mycron")
  async cron(
    @Query("secret") secret: string,
    @Query("isMorning") isMorning: boolean,
    @Query("isMidnight") isMidnight: boolean,
    @Res() res
  ) {
    try {
      // generate secret key
      const now = new Date();
      now.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
      const key1 = `secret_key_${"daraboth"}_${this.telegramService.formatDate(now)}`;
      const key2 = this.telegramService.decryptSecretKeyWithoutEmojis(secret);
      console.log("secret = ", secret);

      if (key1 != key2) {
        console.log(key1, " = ", key2);
        res.status(401).send("error"); //   Send an error response to Telegram
      }

      if (isMorning) await this.telegramService.morning();
      if (isMidnight) await this.telegramService.midnight();
      res.status(200).send("OK"); //   Send a successful response to Telegram
      
    } catch (error) {
      console.error("Error processing Telegram update:", error);
      res.status(500).send("Internal Server Error"); // Handle errors gracefully
    }
  }
}
