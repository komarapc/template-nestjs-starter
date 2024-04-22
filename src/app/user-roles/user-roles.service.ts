import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { UserRolesRepo } from './user-roles.repo';
import { UserRolesQuery } from './user-roles.dto';
import {
  debugConsole,
  ResponseData,
  responseError,
  responseSuccess,
} from '@/lib/utils';
import { Cache } from 'cache-manager';

@Injectable()
export class UserRolesService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userRoleRepo: UserRolesRepo,
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
}
