import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/service/prisma-service';
import { UserRepo } from '../users/users.repo';
import { UserRolesRepo } from '../user-roles/user-roles.repo';
import { BearerMiddleware } from '@/middleware/bearer.middleware';
import { BearerService } from '@/service/bearer.service';
import { TokenService } from '@/service/token.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    BearerService,
    TokenService,
    UserRepo,
    UserRolesRepo,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BearerMiddleware)
      .exclude({ path: 'auth/signin', method: RequestMethod.ALL })
      .forRoutes(AuthController);
  }
}
