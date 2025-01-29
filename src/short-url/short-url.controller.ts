import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShortURLService } from './short-url.service';
import ShortUrlDto from '../dto/short-url.dto';

@Controller('short-url')
export class ShortURLController {
  constructor(private readonly shortURLService: ShortURLService) {}

  @Get('/:shortenedId')
  async getOriginalURL(@Param('shortenedId') shortenedId: string) {
    return this.shortURLService.getOriginalURL(shortenedId);
  }

  @Post('/shorten')
  async shortenURL(@Body() body: ShortUrlDto) {
    return this.shortURLService.shortenURL(body.url);
  }
}
