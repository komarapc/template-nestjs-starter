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
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly userRolesRepo: UserRolesRepo,
  ) {}
  async signin(data: AuthDto) {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user || user.deletedAt)
        return responseError({ code: 404, message: 'User does not exist.' });
      if (!bcrypt.compareSync(data.password, user.password))
        return responseError({ code: 401, message: 'Invalid password' });
      const accessToken = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '3m',
      });
      const { user_roles } = user;
      const roles = user_roles.map((role) => ({
        id: role.roles.id,
        name: role.roles.name,
      }));
      if (!roles.length)
        return responseError({
          code: 403,
          message: 'User does not have any roles.',
        });

      return responseSuccess({
        code: 200,
        data: {
          user: excludeFields(user, ['user_roles', 'password']),
          roles,
          accessToken,
        },
        message: 'Please select a role to continue.',
      });

      return responseSuccess({ code: 200, data: {} });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
}
