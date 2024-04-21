import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { UserQueryDto } from './users.dto';
import { Request, Response } from 'express';

@SkipThrottle({ short: true, medium: false, long: true })
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
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
}
