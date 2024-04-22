import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UserRolesRepo } from './user-roles.repo';
import { UserRolesQuery, UserRolesStoreDto } from './user-roles.dto';
import {
  debugConsole,
  ResponseData,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { Cache } from 'cache-manager';
import { UserRepo } from '../users/users.repo';
import { RolesRepo } from '../roles/roles.repo';

@Injectable()
export class UserRolesService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userRoleRepo: UserRolesRepo,
    private readonly userRepo: UserRepo,
    private readonly roleRepo: RolesRepo,
  ) {}
  async findMany(query: UserRolesQuery) {
    try {
      const { totalData, userRoles } = await this.userRoleRepo.findMany(query);
      const totalPage = Math.ceil(totalData / query.limit);
      const meta = {
        totalData,
        totalPage,
        currentPage: query.page,
        perPage: query.limit,
      };
      return responseSuccess({ code: 200, data: { meta, userRoles } });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  async findManyWithCaching(query: UserRolesQuery) {
    try {
      const key = `user-roles-${JSON.stringify(query)}`;
      const userRolesCache: ResponseData = await this.cacheManager.get(key);
      if (userRolesCache) return userRolesCache;
      const result = await this.findMany(query);
      await this.cacheManager.set(key, result, 1000 * 30);
      return result;
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  async findById(id: string) {
    try {
      if (!id) return responseError({ code: 400, message: 'id is required' });
      const userRole = await this.userRoleRepo.findById(id);
      if (!userRole) return responseError({ code: 404 });
      return responseSuccess({ code: 200, data: userRole });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  async findByIdWithCaching(id: string) {
    try {
      const key = `user-roles-${id}`;
      const userRolesCache: ResponseData = await this.cacheManager.get(key);
      if (userRolesCache) return userRolesCache;
      const result = await this.findById(id);
      await this.cacheManager.set(key, result, 1000 * 30);
      return result;
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  async store(data: UserRolesStoreDto) {
    try {
      const [userExist, roleExist, existUserRole] = await Promise.all([
        this.userRepo.findById(data.userId),
        this.roleRepo.findById(data.roleId),
        this.userRoleRepo.findByUserIdAndRoleId(data.userId, data.roleId),
      ]);
      if (existUserRole)
        return responseError({ code: 409, message: 'User role already exist' });
      const notFoundMessage = this.getNotFoundMessage(userExist, roleExist);
      if (!userExist || !roleExist)
        return responseError({ code: 404, message: notFoundMessage });
      const userRole = await this.userRoleRepo.store(data);
      return responseSuccess({ code: 201, data: userRole });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
  private getNotFoundMessage(userExist: any, roleExist: any) {
    if (!userExist) return 'User not found';
    if (!roleExist) return 'Role not found';
    return null;
  }

  async update(id: string, data: UserRolesStoreDto) {
    try {
      if (!id) return responseError({ code: 400, message: 'id is required' });
      data.id = id;
      const [userExist, roleExist] = await Promise.all([
        this.userRepo.findById(data.userId),
        this.roleRepo.findById(data.roleId),
      ]);
      const notFoundMessage = this.getNotFoundMessage(userExist, roleExist);
      if (!userExist || !roleExist)
        return responseError({ code: 404, message: notFoundMessage });
      const userRole = await this.userRoleRepo.update(data);
      return responseSuccess({
        code: 200,
        data: userRole,
        message: 'User role updated',
      });
    } catch (error) {
      debugConsole(error);
      return responseError({ code: 500 });
    }
  }
}
