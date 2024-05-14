import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SendMessageDto } from "./dto/SendMessageDto";
import { DarabothService } from "./services/daraboth.service";

type send_message_response = {
  response: {
    ok: boolean;
    error_code: number;
    description: string;
  };
  on: {
    method: string;
    payload: {
      chat_id: number;
      text: string;
    };
  };
};

@Controller("telegram")
@ApiTags("telegram")
export class TelegramController {
  private readonly encryptionKey = "encryption_key";

  constructor(
    private readonly darabothService: DarabothService
  ) {}

  @Post("/daraboth/send-message")
  @ApiBody({
    description: "Send a message to a Telegram chat",
    required: true,
    type: SendMessageDto,
  })
  async sendMessageFromDaraboth(@Body() { chatId, message }: SendMessageDto) {
    const res: send_message_response = await this.darabothService.sendMessage(
      chatId,
      message
    );
    if(res.response){
      if (!res.response?.ok) {
        return { message: res.response.description, error: !res.response.ok };
      }
    }
    return { chatId, message };
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

}
