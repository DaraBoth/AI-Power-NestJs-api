import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AIService } from "./ai.service";
import { AI } from "./entities/ai.entity";

@ApiBearerAuth()
@ApiTags("ai")
@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get("/message")
  @ApiResponse({
    status: 200,
    description: "Chat to AI",
    type: AI,
  })
  async replyChat(@Query("message") message: string): Promise<AI> {
    return this.aiService.replyChat(message);
  }
}
