import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlModule } from './short-url/short-url.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://ghaith:JtBMJeYF92Wccmxq@cluster0.xrkih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    ShortUrlModule,
  ],
})
export class AppModule {}
