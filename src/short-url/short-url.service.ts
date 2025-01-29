import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortURL, ShortURLDocument } from '../schemas/shorturl.schema';

@Injectable()
export class ShortURLService {
  constructor(
    @InjectModel(ShortURL.name) private shortURLModel: Model<ShortURLDocument>,
  ) {}

  async shortenURL(url: string) {
    const shortURL = new this.shortURLModel({ url });
    return await shortURL.save(); // Change base URL accordingly
  }

  async getOriginalURL(shortenedId: string) {
    const shortURL = await this.shortURLModel
      .findOne({ shortened_id: shortenedId })
      .exec();
    if (!shortURL) {
      throw new NotFoundException('Shortened URL not found');
    }
    return shortURL;
  }
}
