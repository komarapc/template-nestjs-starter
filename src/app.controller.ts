import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('/')
@ApiResponse({ status: 200, description: 'Ok' })
@ApiResponse({ status: 429, description: 'Too Many Requests' })
@SkipThrottle({ short: true, medium: true, long: false })
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async getHello(@Res() res: Response) {
    const response = await this.appService.getHelloWithCaching();
    res.status(response.statusCode).send(response);
  }
}
