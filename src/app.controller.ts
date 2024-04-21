import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
@SkipThrottle({ short: true, medium: true, long: false })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async getHello(@Res() res: Response) {
    const response = await this.appService.getHello();
    res.status(response.statusCode).send(response);
  }
}
