import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    return { statusCode: 200, statusMessage: 'OK', success: true };
  }
}
