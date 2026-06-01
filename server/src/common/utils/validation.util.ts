import { BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';

export class ValidationException extends BadRequestException {
  constructor(message: string, public readonly errors: Record<string, string[]>) {
    super({
      statusCode: 400,
      message,
      errors,
    });
  }
}

export function formatZodErrors(errors: ZodError['issues']): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  for (const error of errors) {
    const path = error.path.join('.') || 'root';
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(error.message);
  }
  return formatted;
}
