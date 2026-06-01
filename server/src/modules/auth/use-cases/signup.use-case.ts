import { UserAccountRepository, UserAccountDb } from '../repositories/user-account.repository';
import { hashPassword } from '../../../common/utils/password.util';
import { SignupInput } from '../dto/signup.input';
import { UserRole } from '../../../common/enums/role.enum';
import { BaseError } from '../../../common/errors/base.error';

export class SignupUseCase {
  private readonly userAccountRepo: UserAccountRepository;

  constructor(dependencies: { userAccountRepo: UserAccountRepository }) {
    this.userAccountRepo = dependencies.userAccountRepo;
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

    return account;
  }
}
