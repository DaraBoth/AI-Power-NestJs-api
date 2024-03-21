import { ApiProperty } from '@nestjs/swagger';

export class Bot {
  /**
   * The name of the Bots
   * @example Bots
   */
  name: string;

  @ApiProperty({
    example: 'Telegram Bot',
    description: 'Telegram Bot',
  })
  breed: string;
}
