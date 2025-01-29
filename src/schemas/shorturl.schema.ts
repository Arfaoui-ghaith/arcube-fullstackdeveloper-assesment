import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsUrl } from 'class-validator';
import shortUUID from 'short-uuid';

export type ShortURLDocument = HydratedDocument<ShortURL>;

@Schema()
export class ShortURL {
  @Prop({ default: () => shortUUID.generate(), unique: true })
  shortened_id: string;

  @Prop({ required: true })
  @IsUrl()
  url: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ShortURLSchema = SchemaFactory.createForClass(ShortURL);
