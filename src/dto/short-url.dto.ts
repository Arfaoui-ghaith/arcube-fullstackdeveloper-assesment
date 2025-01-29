import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ShortUrlDto {
  @IsUrl()
  @ApiProperty({ example: 'https://example.com' })
  url: string;
}
