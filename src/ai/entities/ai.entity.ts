import { ApiProperty } from '@nestjs/swagger';

export class AI {
  /**
   * The message to the AI
   * @example Hello
   */
  @ApiProperty({
    example: 'Hello',
    description: 'Message to AI',
  })
  message: string;
}
