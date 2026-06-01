import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { AuthResolver } from './auth.resolver';
import { ResponseService } from '../../common/services/response.service';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver, ResponseService, AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
