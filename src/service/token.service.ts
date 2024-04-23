import config from '@/config/app';
import { debugConsole } from '@/lib/utils';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class TokenService {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }
  getToken() {
    return this.token;
  }
  decodeToken() {
    try {
      const result = jwt.decode(this.token, { json: true, complete: true });
      return result;
    } catch (error) {
      debugConsole({ from: 'TokenService', error });
      return null;
    }
  }
  verifyToken() {
    try {
      const result = jwt.verify(this.token, config.jwtSecret);
      return result;
    } catch (error) {
      debugConsole({ from: 'TokenService', error });
      return null;
    }
  }
}
