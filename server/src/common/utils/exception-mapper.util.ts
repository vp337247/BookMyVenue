import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseError } from '../errors/base.error';

export function mapToHttpException(error: unknown): HttpException {
  // 1. If it's already an NestJS HttpException, return it as-is
  if (error instanceof HttpException) {
    return error;
  }

  // 2. If it is a clean core/domain error, map its status code
  if (error instanceof BaseError) {
    const message = error.message;

    switch (error.statusCode) {
      case 400:
        return new BadRequestException(message);
      case 401:
        return new UnauthorizedException(message);
      case 403:
        return new ForbiddenException(message);
      case 404:
        return new NotFoundException(message);
      case 409:
        return new ConflictException(message);
      default:
        return new HttpException(message, error.statusCode);
    }
  }

  // 3. If it's an unexpected system or database query error (e.g. pg / knex)
  // We log the detailed error internally for developers, but keep client responses completely clean
  console.error('Unhandled System Exception:', error);

  return new InternalServerErrorException('An unexpected system error occurred. Please try again later.');
}
