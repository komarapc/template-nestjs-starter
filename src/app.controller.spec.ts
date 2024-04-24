import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';
import { ResponseData } from './lib/utils';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from './service/prisma-service';
describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return the response from the AppService', async () => {
      const result: ResponseData = {
        statusCode: 200,
        statusMessage: 'OK',
        success: true,
      };
      jest
        .spyOn(appService, 'getHelloWithCaching')
        .mockImplementation(() => Promise.resolve(result));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };

      await appController.getHello(res as Response);

      expect(res.status).toHaveBeenCalledWith(result.statusCode);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });
});
