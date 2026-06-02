import { Response } from 'express';
import { UserAccountRepository, UserAccountDb } from '../repositories/user-account.repository';
import { verifyPassword } from '../../../common/utils/password.util';
import { LoginInput } from '../dto/login.input';
import { BaseError } from '../../../common/errors/base.error';
import { AuthService } from '../auth.service';

export class LoginUseCase {
  private readonly userAccountRepo: UserAccountRepository;
  private readonly authService: AuthService;

  constructor(dependencies: { userAccountRepo: UserAccountRepository; authService: AuthService }) {
    this.userAccountRepo = dependencies.userAccountRepo;
    this.authService = dependencies.authService;
  }

  async execute(params: { data: LoginInput; res: Response }): Promise<UserAccountDb> {
    const { email, password } = params.data;

    const user = await this.userAccountRepo.findByEmail(email);
    if (!user) {
      throw new BaseError('Invalid email or password.', 401);
    }

    if (!user.is_verified) {
      throw new BaseError('Please verify your email address before logging in.', 403);
    }

    const auth = await this.userAccountRepo.getAuthDetails(user.id);
    if (!auth) {
      throw new BaseError('Invalid email or password.', 401);
    }

    const isPasswordValid = verifyPassword({
      password,
      salt: auth.password_salt,
      hash: auth.password_hash,
    });

    if (!isPasswordValid) {
      throw new BaseError('Invalid email or password.', 401);
    }

    const token = await this.authService.signToken({
      userId: user.id,
      email: user.email,
      role: user.role_code,
    });

    this.authService.setAuthCookie(params.res, token);

    return user;
  }
}
