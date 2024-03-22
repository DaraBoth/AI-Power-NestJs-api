import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
    @ApiProperty({ description: 'Chat ID of the recipient' })
    chatId: number;
  
    @ApiProperty({ description: 'Message to send' })
    message: string;
  }