import { UserAccountRepository, UserAccountDb } from '../repositories/user-account.repository';
import { VerifyEmailInput } from '../dto/verify-email.input';
import { BaseError } from '../../../common/errors/base.error';
import { ConfigService } from '@nestjs/config';

export class VerifyEmailUseCase {
  private readonly userAccountRepo: UserAccountRepository;
  private readonly configService: ConfigService;

  constructor(dependencies: { userAccountRepo: UserAccountRepository; configService: ConfigService }) {
    this.userAccountRepo = dependencies.userAccountRepo;
    this.configService = dependencies.configService;
  }

  async execute(params: { data: VerifyEmailInput }): Promise<UserAccountDb> {
    const { email, otpCode } = params.data;

    const user = await this.userAccountRepo.findByEmail(email);
    if (!user) {
      throw new BaseError('No account found with this email address.', 404);
    }

    if (user.is_verified) {
      throw new BaseError('This email address is already verified.', 400);
    }

    const otp = await this.userAccountRepo.findOtpByEmail(email);
    if (!otp || otp.is_consumed) {
      throw new BaseError('No verification code found or code has already been consumed.', 400);
    }

    const MAX_ATTEMPTS = Number(this.configService.get<number>('MAX_VERIFICATION_ATTEMPTS'));
    if (otp.attempts >= MAX_ATTEMPTS) {
      throw new BaseError('Too many failed attempts. Please register again to get a new code.', 400);
    }

    const isExpired = new Date() > new Date(otp.expires_at);
    if (isExpired) {
      throw new BaseError('The verification code has expired. Please register again.', 400);
    }

    if (otp.otp_code.toUpperCase() !== otpCode.toUpperCase()) {
      await this.userAccountRepo.incrementOtpAttempts(otp.id);
      const remainingAttempts = MAX_ATTEMPTS - (otp.attempts + 1);

      if (remainingAttempts <= 0) {
        throw new BaseError('Too many failed attempts. Your verification code is now locked. Please register again.', 400);
      }

      throw new BaseError(`Invalid verification code. You have ${remainingAttempts} attempts remaining.`, 400);
    }

    await this.userAccountRepo.verifyUserEmail(email);
    await this.userAccountRepo.consumeOtp(otp.id);

    return {
      ...user,
      is_verified: true,
    };
  }
}
