import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a signed JWT access token.
   */
  async signToken(payload: { userId: string; email: string; role: string }): Promise<string> {
    return this.jwtService.signAsync({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }

  /**
   * Writes the access token into an HTTP-only secure cookie.
   */
  setAuthCookie(res: Response, token: string): void {
    res.cookie('access_token', token, {
      httpOnly: true, // XSS protection (JavaScript cannot read this cookie)
      secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours (matches JWT expiration)
    });
  }

  /**
   * Clears the authentication cookie on logout.
   */
  clearAuthCookie(res: Response): void {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }
}
