import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from './users.repo';
import {
  UserDeleteManyDto,
  UserQueryDto,
  UserStoreDto,
  UserUpdateDto,
} from './users.dto';
import {
  debugConsole,
  generateId,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserRolesRepo } from '../user-roles/user-roles.repo';
import { RolesRepo } from '../roles/roles.repo';
import * as bcrypt from 'bcrypt';
import config from '@/config/app';
@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userRepo: UserRepo,
    private readonly userRolesRepo: UserRolesRepo,
    private readonly roleRepo: RolesRepo,
  ) {}

  async findManyWithCaching(query?: UserQueryDto) {
    try {
      const key = `users-${JSON.stringify(query)}`;
      query.limit = Number(query.limit) || 10;
      let users: any = await this.cacheManager.get(key);
      if (users)
        return responseSuccess({
          data: users,
          code: 200,
        });

      const { totalData, users: result } = await this.userRepo.findMany(query);
      const totalPage = Math.ceil(totalData / query.limit || 10);
      const data = {
        meta: { totalData, totalPage, limit: Number(query.limit) || 10 },
        users: result,
      };
      await this.cacheManager.set(key, data, 1000 * 10);
      return responseSuccess({ data, code: 200 });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async findByIdWithCaching(id: string) {
    try {
      if (!id) return responseError({ code: 400, message: 'id is required' });
      const key = `user-${id}`;
      let userCache: any = await this.cacheManager.get(key);
      if (userCache) return responseSuccess({ data: userCache, code: 200 });
      const user = await this.userRepo.findById(id);
      if (!user) return responseError({ code: 404, message: 'User not found' });
      await this.cacheManager.set(key, user, 1000 * 10);
      return responseSuccess({ data: user, code: 200 });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async store(data: UserStoreDto) {
    try {
      const [roles, userExist] = await Promise.all([
        this.roleRepo.findById(data.roleId),
        this.userRepo.findByEmail(data.email),
      ]);
      if (userExist)
        return responseError({ code: 409, message: 'Email already exist' });
      if (!roles)
        return responseError({ code: 404, message: 'Role not found' });
      data.userId = generateId();
      data.password = bcrypt.hashSync(data.password, config.saltRound || 10);
      const [storeUser, storeUserRoles] = await Promise.all([
        this.userRepo.create(data),
        this.userRolesRepo.store({ userId: data.userId, roleId: data.roleId }),
      ]);
      return responseSuccess({
        code: 201,
        data: { user: storeUser, roles: storeUserRoles },
      });
    } catch (error) {}
  }

  async update(data: UserUpdateDto) {
    try {
      const [existUser, existEmail] = await Promise.all([
        this.userRepo.findById(data.id),
        this.userRepo.findByEmail(data.email),
      ]);
      if (!existUser)
        return responseError({ code: 404, message: 'User not found' });
      if (existEmail && existEmail.id !== data.id)
        return responseError({ code: 409, message: 'Email already exist' });
      if (data.password)
        data.password = bcrypt.hashSync(data.password, config.saltRound || 10);
      const user = await this.userRepo.update(data);
      return responseSuccess({ code: 200, data: user });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async delete(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) return responseError({ code: 404, message: 'User not found' });
      await this.userRepo.delete(id);
      return responseSuccess({
        code: 200,
        message: 'User deleted successfully',
      });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }

  async deleteMany(data: UserDeleteManyDto) {
    try {
      const { data: lists } = data;
      const userNotExist: Array<{ userId: string }> = [];
      let affectedRows = 0;
      for (const { userId } of lists) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
          userNotExist.push({ userId });
          continue;
        }
        await this.userRepo.delete(userId);
        affectedRows++;
      }
      return responseSuccess({
        code: 200,
        message: `${affectedRows} user deleted successfully. ${userNotExist.length} failed to delete.`,
        data: {
          failed: userNotExist,
        },
      });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
}
