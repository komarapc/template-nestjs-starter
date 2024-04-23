import { responseError } from '@/lib/utils';
import { BearerService } from '@/service/bearer.service';
import { TokenService } from '@/service/token.service';
import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BearerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(BearerMiddleware.name);
  constructor(
    private readonly bearerService: BearerService,
    private readonly tokenService: TokenService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(BearerMiddleware.name);
    const authorization = req.headers.authorization;
    if (!authorization) throw new UnauthorizedException();
    this.bearerService.setAuthorization(authorization);
    this.tokenService.setToken(this.bearerService.getAuthorizationToken());
    if (!this.bearerService.isBearer() || !this.tokenService.verifyToken())
      throw new UnauthorizedException();
    next();
  }
}
