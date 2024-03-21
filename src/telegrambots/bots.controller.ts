import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { Bot } from './entities/bots.entity';

@ApiBearerAuth()
@ApiTags('bots')
@Controller('bots')
export class BotController {
  constructor(private readonly botsService: BotsService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create cat' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // async create(@Body() createCatDto: CreateCatDto): Promise<Bot> {
  //   return this.catsService.create(createCatDto);
  // }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Bot,
  })
  findOne(@Param('id') id: string): Bot {
    return this.botsService.findOne(+id);
  }
}
