import { UserAccountRepository } from '../repositories/user-account.repository';
import { ForgotPasswordInput } from '../dto/forgot-password.input';
import { EmailService } from '../../../common/services/email.service';
import { generateOtp } from '../../../common/utils/otp.util';
import { OtpPurpose } from '../../../common/enums/otp-purpose.enum';

export class ForgotPasswordUseCase {
  private readonly userAccountRepo: UserAccountRepository;
  private readonly emailService: EmailService;

  constructor(dependencies: { userAccountRepo: UserAccountRepository; emailService: EmailService }) {
    this.userAccountRepo = dependencies.userAccountRepo;
    this.emailService = dependencies.emailService;
  }

  async execute(params: { data: ForgotPasswordInput }): Promise<void> {
    const { email } = params.data;

    const user = await this.userAccountRepo.findByEmail(email);
    if (!user) {
      return;
    }

    const otpCode = generateOtp(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.userAccountRepo.createOtp(user.email, otpCode, expiresAt, OtpPurpose.RESET_PASSWORD);

    await this.emailService.sendMail({
      to: user.email,
      subject: 'Reset Your Password - BookMyVenue',
      templateName: 'hbs/reset-password-otp',
      context: { name: user.first_name, otp: otpCode },
    });
  }
}
