import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ZodType } from 'zod';
import { ValidationException, formatZodErrors } from '../utils/validation.util';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) { }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new ValidationException(
        'Input validation failed',
        formatZodErrors(result.error.issues),
      );
    }
    return result.data;
  }
}
