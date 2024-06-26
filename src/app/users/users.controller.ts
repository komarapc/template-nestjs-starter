import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import {
  UserDeleteManyDto,
  UserQueryDto,
  UserStoreDto,
  UserUpdateDto,
} from './users.dto';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '@/lib/utils';

@ApiTags('users')
@ApiBearerAuth()
@ApiCommonResponses()
@SkipThrottle({ short: true, medium: false, long: true })
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  async getUsers(
    @Query() query: UserQueryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.userService.findManyWithCaching(query);
    res.status(result.statusCode).send(result);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.findByIdWithCaching(id);
    res.status(result.statusCode).send(result);
  }

  @Post()
  async createUser(@Body() body: UserStoreDto, @Res() res: Response) {
    const result = await this.userService.store(body);
    res.status(result.statusCode).send(result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UserUpdateDto,
    @Res() res: Response,
  ) {
    body.id = id;
    const result = await this.userService.update(body);
    res.status(result.statusCode).send(result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.userService.delete(id);
    res.status(result.statusCode).send(result);
  }
  @Delete('/bulk-delete')
  async bulkDelete(@Body() body: UserDeleteManyDto, @Res() res: Response) {
    const result = await this.userService.deleteMany(body);
    res.status(result.statusCode).send(result);
  }
}
