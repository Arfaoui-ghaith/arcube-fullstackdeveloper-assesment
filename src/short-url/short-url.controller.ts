import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ShortURLService } from './short-url.service';
import ShortUrlDto from '../dto/short-url.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('short-url')
@Controller()
export class ShortURLController {
  constructor(
    private readonly shortURLService: ShortURLService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/verify/:shortenedId')
  async verifyURL(@Param('shortenedId') shortenedId: string) {
    return await this.shortURLService.verifyShortURL(shortenedId);
  }

  @ApiExcludeEndpoint()
  @Get('/:shortenedId')
  async getOriginalURL(
    @Param('shortenedId') shortenedId: string,
    @Res() res: Response,
  ) {
    const shortURL = await this.shortURLService.getOriginalURL(shortenedId);
    if (!shortURL) {
      return res.redirect(this.configService.getOrThrow('CLIENT_HOST'));
    }
    return res.redirect(shortURL.url);
  }

  @Post('/shorten')
  async shortenURL(@Body() body: ShortUrlDto) {
    return this.shortURLService.shortenURL(body);
  }
}
