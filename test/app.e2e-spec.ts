import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ShortURLController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /verify/:shortenedId', () => {
    it('should return the original URL for the given shortened ID', async () => {
      const shortenedId = 'UkTycN';

      return request(app.getHttpServer())
        .get(`/verify/${shortenedId}`)
        .expect(200);
    }, 10000);

    it('should return a 404 if the shortened ID is not found', async () => {
      const shortenedId = 'mockShortenedId';

      return request(app.getHttpServer())
        .get(`/verify/${shortenedId}`)
        .expect(404);
    }, 10000);
  });

  describe('POST /shorten', () => {
    it('should return the shortened URL object when a valid URL is provided', async () => {
      const url =
        'https://www.quora.com/Can-you-recommend-any-websites-with-unusually-long-URLs-What-is-the-purpose-of-creating-such-long-URLs';

      return request(app.getHttpServer())
        .post('/shorten')
        .send({ url: url })
        .expect(201);
    }, 10000);

    it('should return a 400 for an invalid URL', async () => {
      const invalidUrl = 'invalid-url';

      return request(app.getHttpServer())
        .post('/shorten')
        .send({ url: invalidUrl })
        .expect(400);
    }, 10000);
  });

  afterAll(async () => {
    await app.close();
  });
});
