import { Injectable } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import {
  debugConsole,
  excludeFields,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { UserRepo } from '../users/users.repo';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserRolesRepo } from '../user-roles/user-roles.repo';
import config from '@/config/app';
import { TokenService } from '@/service/token.service';
interface Payload extends jwt.JwtPayload {
  userId: string;
  rememberMe: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly userRolesRepo: UserRolesRepo,
    private readonly tokenService: TokenService,
  ) {}
  async signin(data: AuthDto) {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user || user.deletedAt)
        return responseError({ code: 404, message: 'User does not exist.' });
      if (!bcrypt.compareSync(data.password, user.password))
        return responseError({ code: 401, message: 'Invalid password' });
      const payload = { userId: user.id, rememberMe: data.rememberMe };
      const accessToken = this.tokenService.generateToken(payload, '3m');
      const roles = user.user_roles.map((role) => ({
        id: role.roles.id,
        name: role.roles.name,
      }));
      if (!roles.length)
        return responseError({
          code: 403,
          message: 'User does not have any roles.',
        });
      const response = {
        user: excludeFields(user, ['user_roles', 'password']),
        roles,
        accessToken,
      };
      return responseSuccess({
        code: 200,
        data: response,
        message: 'Please select a role to continue.',
      });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async signinWithRole(roleId: string) {
    try {
      const { userId, rememberMe } = this.tokenService.decodeToken<Payload>();
      const [userRoles, user] = await Promise.all([
        this.userRolesRepo.findByUserIdAndRoleId(userId, roleId),
        this.userRepo.findById(userId),
      ]);
      if (!userRoles)
        return responseError({
          code: 403,
          message: 'User does not have this role.',
        });
      const payload = { userId, roleId };
      const response = {
        user: excludeFields(user, ['user_roles']),
        roles: userRoles.roles,
        token: this.getTokenAuth(payload, rememberMe),
      };
      return responseSuccess({ code: 200, data: response });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  private getTokenAuth(payload: any, rememberMe: boolean) {
    const expiresIn = rememberMe ? '7d' : '3m';
    return this.tokenService.generateToken(payload, expiresIn);
  }
}
