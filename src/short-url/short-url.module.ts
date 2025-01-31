import { Module } from '@nestjs/common';
import { ShortURLController } from './short-url.controller';
import { ShortURLService } from './short-url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortURL, ShortURLSchema } from '../schemas/shorturl.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ShortURL.name, schema: ShortURLSchema },
    ]),
  ],
  controllers: [ShortURLController],
  providers: [ShortURLService],
})
export class ShortUrlModule {}
