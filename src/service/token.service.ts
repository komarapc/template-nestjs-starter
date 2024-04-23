import config from '@/config/app';
import { debugConsole, generateId } from '@/lib/utils';
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
  decodeToken<T>(): T {
    try {
      const { payload } = jwt.decode(this.token, {
        json: true,
        complete: true,
      });
      return payload as T;
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
  generateToken(payload: any, expiresIn: string) {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn,
      jwtid: generateId(32),
    });
  }
}
