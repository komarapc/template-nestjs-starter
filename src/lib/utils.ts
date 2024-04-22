import config from '@/config/app';
import { customAlphabet } from 'nanoid';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const generateId = (length = 21) => {
  const alphabets =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return customAlphabet(alphabets, length)();
};

export const excludeFields = <T>(object: T, keys: Array<keyof T>): T => {
  if (!Object.keys(object).length) return object;
  const result = { ...object };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export type ResponseData = {
  statusCode: number;
  statusMessage: string;
  success: boolean;
  message?: any;
  data?: any;
};

const HTTP_STATUS_CODE_MESSAGES: Record<number, string> = {
  200: 'OK',
  201: 'CREATED',
  202: 'ACCEPTED',
  204: 'NO CONTENT',
  400: 'BAD REQUEST',
  401: 'UNAUTHORIZED',
  402: 'PAYMENT REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT FOUND',
  405: 'METHOD NOT ALLOWED',
  406: 'NOT ACCEPTABLE',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE ENTITY',
  429: 'TOO MANY REQUESTS',
  500: 'INTERNAL SERVER ERROR',
};

type ResponseProps = {
  code: number;
  message?: string;
  data?: any;
};
export const responseSuccess = (props: ResponseProps): ResponseData => {
  const { code, message, data } = props;
  return {
    statusCode: code,
    statusMessage: HTTP_STATUS_CODE_MESSAGES[code],
    success: true,
    message,
    data,
  };
};

export const responseError = (props: ResponseProps): ResponseData => {
  const { code, message, data } = props;
  return {
    statusCode: code,
    statusMessage: HTTP_STATUS_CODE_MESSAGES[code],
    success: false,
    message,
    data,
  };
};

export const debugConsole = (payload: any) => {
  config.debug && console.log(payload);
};

export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse({ status: 200, description: 'Ok' }),
    ApiResponse({ status: 201, description: 'Created' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 409, description: 'Conflict' }),
    ApiResponse({ status: 429, description: 'Too Many Requests' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}
