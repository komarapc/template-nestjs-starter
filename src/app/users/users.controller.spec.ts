import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../service/prisma-service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ResponseData } from '@/lib/utils';
import { UserQueryDto } from './users.dto';
import { Request, Response } from 'express';
import { UserRepo } from './users.repo';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService,
        UserRepo,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });
  describe('getUsers', () => {
    it('should return the response from the UsersService', async () => {
      const result: ResponseData = {
        statusCode: 200,
        statusMessage: 'OK',
        success: true,
      };
      jest
        .spyOn(userService, 'findManyWithCaching')
        .mockImplementation(() => Promise.resolve(result));

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const req: Partial<Request> = {};

      await controller.getUsers(
        {} as UserQueryDto,
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(result.statusCode);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });
});
