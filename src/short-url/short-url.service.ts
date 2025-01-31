import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortURL, ShortURLDocument } from '../schemas/shorturl.schema';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import ShortUrlDto from '../dto/short-url.dto';
import * as axios from 'axios';

@Injectable()
export class ShortURLService {
  constructor(
    @InjectModel(ShortURL.name) private shortURLModel: Model<ShortURLDocument>,
    private readonly httpService: HttpService,
  ) {}

  async shortenURL(data: ShortUrlDto) {
    const { url } = data;
    const shortURL = new this.shortURLModel({ url });
    try {
      const res = await this.httpService.axiosRef.get(url);
      const status = res.status;
      const logoUrl = this.extractWebsiteLogo(res.data);
      shortURL.status = status;
      shortURL.logo = logoUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          shortURL.status = 503;
        } else if (error.response.status === 999) {
          shortURL.status = 200;
        } else {
          shortURL.status = error.response.status;
        }
      } else {
        shortURL.status = 500;
      }
      shortURL.logo = 'https://cdn-icons-png.flaticon.com/512/5339/5339181.png';
    }

    return await shortURL.save();
  }

  async getOriginalURL(shortenedId: string) {
    return await this.shortURLModel
      .findOne({ shortened_id: shortenedId })
      .exec();
  }

  async verifyShortURL(shortenedId: string) {
    const shortURL = await this.getOriginalURL(shortenedId);
    if (!shortURL) {
      throw new HttpException('Short URL not found', 404);
    }
    return shortURL;
  }

  private extractWebsiteLogo(html: string): string {
    const $ = cheerio.load(html);
    let logoUrl: string | undefined = '';
    const logoImage = $(
      'img[alt*="logo"], img[class*="logo"], img[id*="logo"]',
    ).first();
    if (logoImage.length) {
      logoUrl = logoImage.attr('src');
    }
    if (!logoUrl) {
      const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').first();
      if (favicon.length) {
        logoUrl = favicon.attr('href');
      }
    }
    if (!logoUrl || !logoUrl.startsWith('https')) {
      return 'https://cdn-icons-png.flaticon.com/512/5339/5339181.png';
    }
    return logoUrl;
  }
}
