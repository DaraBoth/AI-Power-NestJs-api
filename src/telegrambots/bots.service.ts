import { Injectable } from "@nestjs/common";
import { CreateBotDto } from "./dto/create-bot.dto";
import { Bot } from "./entities/bots.entity";

@Injectable()
export class BotsService {
  private readonly bots: Bot[] = [];

  create(bots: CreateBotDto): Bot {
    this.bots.push(bots);
    return bots;
  }

  findOne(id: number): Bot {
    return this.bots[id];
  }

  replyChat(question: string): string {
    let answer = ""
    answer += "Hello"

    return answer;
  }
}
