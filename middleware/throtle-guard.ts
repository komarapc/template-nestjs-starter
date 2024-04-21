import { ThrottlerGuard as BaseThrottlerGuard } from '@nestjs/throttler';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ThrottlerGuard extends BaseThrottlerGuard {
  async throwThrottlingException() {
    throw new HttpException(
      'You are sending too many requests. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
