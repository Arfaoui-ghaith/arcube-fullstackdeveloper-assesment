import { Test, TestingModule } from '@nestjs/testing';
import { ShortURLController } from './short-url.controller';
import { ShortURLService } from './short-url.service';
import { ShortURL } from '../schemas/shorturl.schema';
import { getModelToken } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('ShortURLController', () => {
  let controller: ShortURLController;
  let shortURLModel: any;
  let shortURLService: jest.Mocked<ShortURLService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [ShortURLController],
      providers: [
        ShortURLService,
        {
          provide: getModelToken(ShortURL.name),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue({
              url: 'https://www.quora.com/...',
              shortened_id: 'UkTycN',
              status: 200,
              logo: 'https://www.quora.com/logo.png',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ShortURLController>(ShortURLController);
    shortURLService = module.get<jest.Mocked<ShortURLService>>(ShortURLService);
    shortURLModel = module.get(getModelToken(ShortURL.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyURL', () => {
    it('should return the original URL', async () => {
      const originalUrl =
        'https://www.quora.com/Can-you-recommend-any-websites-with-unusually-long-URLs-What-is-the-purpose-of-creating-such-long-URLs';
      const shortenedId = 'UkTycN';

      // Mock the findOne method to return the original URL
      shortURLModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ url: originalUrl }),
      });

      const res = await controller.verifyURL(shortenedId);
      expect(res?.url).toEqual(originalUrl);
    });
  });

  describe('shortenURL', () => {
    it('should return the shortened URL Object', async () => {
      const url =
        'https://www.quora.com/Can-you-recommend-any-websites-with-unusually-long-URLs-What-is-the-purpose-of-creating-such-long-URLs';

      // Mocking the service method for shortenURL
      shortURLService.shortenURL = jest.fn().mockResolvedValue({
        url,
        shortened_id: 'mockShortenedId', // auto-generated
        status: 200, // handled by service
        logo: 'https://qsf.cf2.quoracdn.net/-4-images.favicon-new.ico-26-07ecf7cd341b6919.ico', // handled by service
      });

      const res = await controller.shortenURL({ url });

      expect(res).toBeDefined();
      expect(res.url).toBe(url);
      expect(res.shortened_id).toBeDefined(); // Ensure shortened_id is auto-generated
      expect(res.status).toBe(200); // Ensure status is auto-handled
      expect(res.logo).toBe(
        'https://qsf.cf2.quoracdn.net/-4-images.favicon-new.ico-26-07ecf7cd341b6919.ico',
      );
    });
  });
});
