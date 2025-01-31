import { Test, TestingModule } from '@nestjs/testing';
import { ShortURLService } from './short-url.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { ShortURL } from '../schemas/shorturl.schema';

describe('ShortURLService', () => {
  let service: ShortURLService;
  let model: Model<ShortURL>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortURLService,
        {
          provide: getModelToken(ShortURL.name),
          useValue: {
            new: jest.fn().mockResolvedValue({
              shortened_id: 'generatedId', // Simulating the generated ID
              url: 'http://example.com',
              save: jest.fn().mockResolvedValue({
                shortened_id: 'generatedId',
                url: 'http://example.com',
              }),
            }),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShortURLService>(ShortURLService);
    model = module.get<Model<ShortURL>>(getModelToken(ShortURL.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenURL', () => {
    it('should return a shortened URL with generated ID', async () => {
      const url = 'http://example.com';
      const result = await service.shortenURL(url);
      expect(result).toBe(`http://localhost:3000/${result.id}`);
    });

    it('should call model.save', async () => {
      const saveSpy = jest.spyOn(model.prototype, 'save');
      const url = 'http://example.com';
      await service.shortenURL(url);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOriginalURL', () => {
    it('should return the original URL for a valid shortened ID', async () => {
      const id = 'generatedId';
      const findOneMock = jest.spyOn(model, 'findOne').mockResolvedValue({
        shortened_id: id,
        url: 'http://example.com',
      });

      const result = await service.getOriginalURL(id);
      expect(result).toBe('http://example.com');
      expect(findOneMock).toHaveBeenCalledWith({ shortened_id: id });
    });

    it('should throw NotFoundException if shortened URL is not found', async () => {
      const id = 'nonexistentId';
      const findOneMock = jest.spyOn(model, 'findOne').mockResolvedValue(null);

      try {
        await service.getOriginalURL(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect((error as NotFoundException).message).toBe(
          'Shortened URL not found',
        );
      }

      expect(findOneMock).toHaveBeenCalledWith({ shortened_id: id });
    });
  });
});
