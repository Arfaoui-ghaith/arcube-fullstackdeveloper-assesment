import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortURL, ShortURLDocument } from '../schemas/shorturl.schema';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ShortURLService {
  constructor(
    @InjectModel(ShortURL.name) private shortURLModel: Model<ShortURLDocument>,
    private readonly httpService: HttpService,
  ) {}

  async shortenURL(url: string) {
    const shortURL = new this.shortURLModel({ url });
    const res = await this.httpService.axiosRef.get(url);
    const status = res.status;
    const logoUrl = this.extractWebsiteLogo(res.data);
    shortURL.status = status;
    shortURL.logo = logoUrl;
    return await shortURL.save(); // Change base URL accordingly
  }

  async getOriginalURL(shortenedId: string) {
    return await this.shortURLModel
      .findOne({ shortened_id: shortenedId })
      .exec();
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
    return logoUrl || 'https://cdn-icons-png.flaticon.com/512/5339/5339181.png';
  }
}
