import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    // 1. Extract token
    let token: string | null = null;

    // Extract from Authorization header (Mobile fallback)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Extract from Cookie (Web primary)
    if (!token && req.cookies) {
      token = req.cookies['access_token'];
    }

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing. Please log in.');
    }

    // 2. Validate token signature and expiration
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      
      // 3. Attach the authenticated user payload to the request context
      req.user = decoded;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication token is invalid or has expired. Please log in again.');
    }
  }
}
