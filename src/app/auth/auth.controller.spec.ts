import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto, AuthWithRoleDto } from './auth.dto';
import { responseSuccess, responseError } from '@/lib/utils';
import { Request, Response } from 'express';
import { PrismaService } from '@/service/prisma-service';
// Mock AuthService methods
const mockAuthService = {
  signin: jest.fn(),
  signinWithRole: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        PrismaService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    service = app.get<AuthService>(AuthService);
  });
  describe('signin', () => {
    it('should return the response from the AuthService for successful signin', async () => {
      const result = responseSuccess({
        code: 200,
        data: {},
        message: 'Please select a role to continue.',
      });
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      const body: AuthDto = {
        email: 'user@example.com',
        password: 'password',
        rememberMe: true,
      };
      mockAuthService.signin.mockResolvedValue(result);
      await controller.signin(res as Response, body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(result);
    });

    it('should return 400', async () => {
      const result = responseError({ code: 400 });
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      const body: AuthDto = {
        email: '',
        password: '',
        rememberMe: false,
      };
      mockAuthService.signin.mockResolvedValue(result);
      await controller.signin(res as Response, body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });

  describe('signinRole', () => {
    it('should return the response from the AuthService', async () => {
      const result = responseError({ code: 500 });
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      const body: AuthWithRoleDto = {
        roleId: '',
      };
      mockAuthService.signinWithRole.mockResolvedValue(result);
      await controller.signinRole({} as Request, res as Response, body);
      expect(res.status).toHaveBeenCalledWith(result.statusCode);
      expect(res.send).toHaveBeenCalledWith(result);
    });
  });
});
