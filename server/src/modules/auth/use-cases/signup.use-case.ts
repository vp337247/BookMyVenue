import { UserAccountRepository, UserAccountDb } from '../repositories/user-account.repository';
import { hashPassword } from '../../../common/utils/password.util';
import { SignupInput } from '../dto/signup.input';
import { UserRole } from '../../../common/enums/role.enum';
import { BaseError } from '../../../common/errors/base.error';
import { EmailService } from '../../../common/services/email.service';
import { generateOtp } from '../../../common/utils/otp.util';

export class SignupUseCase {
  private readonly userAccountRepo: UserAccountRepository;
  private readonly emailService: EmailService;

  constructor(dependencies: { userAccountRepo: UserAccountRepository; emailService: EmailService }) {
    this.userAccountRepo = dependencies.userAccountRepo;
    this.emailService = dependencies.emailService;
  }

  async execute(params: { data: SignupInput }): Promise<UserAccountDb> {
    const { firstName, lastName, email, phone, countryCode, password } = params.data;

    const existingUser = await this.userAccountRepo.findByEmail(email);
    if (existingUser) {
      throw new BaseError(`A user account with email "${email}" already exists.`, 409);
    }

    const existingPhone = await this.userAccountRepo.findByPhone(phone);
    if (existingPhone) {
      throw new BaseError(`A user account with phone number "${phone}" already exists.`, 409);
    }

    const { salt, hash } = hashPassword(password);

    const account = await this.userAccountRepo.create({
      email,
      first_name: firstName,
      last_name: lastName || null,
      role_code: UserRole.USER,
      phone_number: phone,
      country_code: countryCode || null,
    });

    await this.userAccountRepo.createAuth({
      user_account_id: account.id,
      password_salt: salt,
      password_hash: hash,
    });

    const otpCode = generateOtp(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.userAccountRepo.createOtp(account.email, otpCode, expiresAt);

    await this.emailService.sendMail({
      to: account.email,
      subject: 'Verify Your Email Address - BookMyVenue',
      templateName: 'hbs/verify-email',
      context: { name: account.first_name, otp: otpCode },
    });

    return account;
  }
}
