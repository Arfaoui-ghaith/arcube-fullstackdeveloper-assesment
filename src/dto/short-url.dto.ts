import { IsUrl } from 'class-validator';

export default class ShortUrlDto {
  @IsUrl()
  url: string;
}
