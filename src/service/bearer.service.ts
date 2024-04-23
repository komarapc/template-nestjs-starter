import { Injectable } from '@nestjs/common';

@Injectable()
export class BearerService {
  private authorization: string = '';
  private authorizationType: string = '';
  private authorizationToken: string = '';

  setAuthorization(authorization: string) {
    this.authorization = authorization;
    const [authorizationType, authorizationToken] = authorization.split(' ');
    this.authorizationType = authorizationType;
    this.authorizationToken = authorizationToken;
  }

  getAuthorization() {
    return this.authorization;
  }

  getAuthorizationType() {
    return this.authorizationType;
  }
  getAuthorizationToken() {
    return this.authorizationToken;
  }
  isBearer() {
    return this.authorizationType === 'Bearer';
  }
}
