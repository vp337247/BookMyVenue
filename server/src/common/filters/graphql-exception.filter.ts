import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ValidationException } from '../utils/validation.util';

@Catch()
export class GraphQlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Standard GqlArgumentsHost creation (enables context parsing)
    GqlArgumentsHost.create(host);

    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let extensions: Record<string, any> = {};

    if (exception instanceof ValidationException) {
      // 1. Handle Zod input validation exceptions
      statusCode = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      code = 'BAD_USER_INPUT';
      extensions = {
        validationErrors: exception.errors,
      };
    } else if (exception instanceof HttpException) {
      // 2. Handle built-in NestJS HttpExceptions (e.g. NotFound, Unauthorized)
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
        code = (response as any).error || 'BAD_REQUEST';
        extensions = { ...response };
      } else {
        message = exception.message;
        code = 'HTTP_EXCEPTION';
      }
    } else if (exception instanceof Error) {
      // 3. Handle general runtime/DB errors (masks details in prod)
      message = exception.message;
      code = 'INTERNAL_SERVER_ERROR';
    }

    // Format and return the GraphQLError
    return new GraphQLError(message, {
      extensions: {
        code,
        statusCode,
        timestamp: new Date().toISOString(),
        ...extensions,
      },
    });
  }
}
