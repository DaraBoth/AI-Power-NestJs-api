import { Body, Controller, Post, Request, Res } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SendMessageDto } from "./dto/SendMessageDto";

@Controller("telegram")
@ApiTags('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post("/send-message")
  @ApiBody({
    description: "Send a message to a Telegram chat",
    required: true,
    type: SendMessageDto,
  })
  async sendMessage(@Body() { chatId, message }: SendMessageDto) {
    await this.telegramService.sendMessage(chatId, message);
    return { message: "Sent message to Telegram bot!" };
  }
  
  @Post("/webhook")
  async handleUpdate(@Body() messageObject: any,@Res() res) {
    try {
      await this.telegramService.handleUpdate(messageObject);
      res.status(200).send("OK"); // Send a successful response to Telegram
    } catch (error) {
      console.error("Error processing Telegram update:", error);
      res.status(500).send("Internal Server Error"); // Handle errors gracefully
    }
  }
}
