import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsUrl } from 'class-validator';
import * as shortID from 'short-unique-id';

export type ShortURLDocument = HydratedDocument<ShortURL>;
const uuid = new shortID({ length: 6 });
@Schema()
export class ShortURL {
  @Prop({ default: () => uuid.rnd(), unique: true })
  shortened_id: string;

  @Prop({ required: true })
  @IsUrl()
  url: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ShortURLSchema = SchemaFactory.createForClass(ShortURL);
