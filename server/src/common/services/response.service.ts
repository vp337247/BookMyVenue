import { Injectable } from '@nestjs/common';
import { BaseResult } from '../../modules/auth/types/shared.type';
import { StatusCode } from '../enums/status-code.enum';

@Injectable()
export class ResponseService {

  success(message: string, statusCode: StatusCode = StatusCode.SUCCESS): BaseResult {
    return {
      success: true,
      message,
      statusCode,
    };
  }

  error(message: string, statusCode: StatusCode = StatusCode.BAD_REQUEST): BaseResult {
    return {
      success: false,
      message,
      statusCode,
    };
  }
}
