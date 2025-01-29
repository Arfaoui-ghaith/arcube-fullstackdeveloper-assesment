import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortURL, ShortURLDocument } from '../schemas/shorturl.schema';

@Injectable()
export class ShortURLService {
  constructor(
    @InjectModel(ShortURL.name) private shortURLModel: Model<ShortURLDocument>,
  ) {}

  async shortenURL(url: string): Promise<string> {
    const shortURL = new this.shortURLModel({ url });
    const savedURL = await shortURL.save();
    return `http://localhost:3000/${savedURL.id}`; // Change base URL accordingly
  }

  async getOriginalURL(shortenedId: string): Promise<string> {
    const shortURL = await this.shortURLModel
      .findOne({ id: shortenedId })
      .exec();
    if (!shortURL) {
      throw new NotFoundException('Shortened URL not found');
    }
    return shortURL.url;
  }
}
