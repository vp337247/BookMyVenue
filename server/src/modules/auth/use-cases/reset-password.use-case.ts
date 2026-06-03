import { UserAccountRepository, UserAccountDb } from '../repositories/user-account.repository';
import { ResetPasswordInput } from '../dto/reset-password.input';
import { BaseError } from '../../../common/errors/base.error';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from '../../../common/utils/password.util';
import { OtpPurpose } from '../../../common/enums/otp-purpose.enum';
import { EmailService } from '../../../common/services/email.service';

export class ResetPasswordUseCase {
  private readonly userAccountRepo: UserAccountRepository;
  private readonly configService: ConfigService;
  private readonly emailService: EmailService;

  constructor(dependencies: {
    userAccountRepo: UserAccountRepository;
    configService: ConfigService;
    emailService: EmailService;
  }) {
    this.userAccountRepo = dependencies.userAccountRepo;
    this.configService = dependencies.configService;
    this.emailService = dependencies.emailService;
  }

  async execute(params: { data: ResetPasswordInput }): Promise<UserAccountDb> {
    const { email, otpCode, newPassword } = params.data;

    const user = await this.userAccountRepo.findByEmail(email);
    if (!user) {
      throw new BaseError('No account found with this email address.', 404);
    }

    const otp = await this.userAccountRepo.findOtpByEmail(email, OtpPurpose.RESET_PASSWORD);
    if (!otp || otp.is_consumed) {
      throw new BaseError('No active password reset code found or code has already been used.', 400);
    }

    const MAX_ATTEMPTS = Number(this.configService.get<number>('MAX_VERIFICATION_ATTEMPTS', 5));
    if (otp.attempts >= MAX_ATTEMPTS) {
      throw new BaseError('Too many failed attempts. Please request a new password reset code.', 400);
    }

    const isExpired = new Date() > new Date(otp.expires_at);
    if (isExpired) {
      throw new BaseError('The password reset code has expired. Please request a new one.', 400);
    }

    if (otp.otp_code.toUpperCase() !== otpCode.toUpperCase()) {
      await this.userAccountRepo.incrementOtpAttempts(otp.id);
      const remainingAttempts = MAX_ATTEMPTS - (otp.attempts + 1);

      if (remainingAttempts <= 0) {
        throw new BaseError('Too many failed attempts. Your password reset code is now locked. Please request a new code.', 400);
      }

      throw new BaseError(`Invalid password reset code. You have ${remainingAttempts} attempts remaining.`, 400);
    }

    const { salt, hash } = hashPassword(newPassword);
    await this.userAccountRepo.updateAuth(user.id, {
      password_salt: salt,
      password_hash: hash,
    });

    await this.userAccountRepo.consumeOtp(otp.id);

    await this.emailService.sendMail({
      to: user.email,
      subject: 'Password Reset Successful - BookMyVenue',
      templateName: 'hbs/password-reset-success',
      context: { name: user.first_name },
    });

    return user;
  }
}
