import { Knex } from 'knex';

export interface UserAccountDb {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  role_code: string;
  phone_number: string | null;
  country_code: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export class UserAccountRepository {
  constructor(private readonly db: Knex | Knex.Transaction) { }

  async findByEmail(email: string): Promise<UserAccountDb | undefined> {
    return this.db('user_account').where({ email }).first();
  }

  async findByPhone(phone: string): Promise<UserAccountDb | undefined> {
    return this.db('user_account').where({ phone_number: phone }).first();
  }

  async create(data: {
    email: string;
    first_name: string;
    last_name?: string | null;
    role_code: string;
    phone_number: string;
    country_code: string;
  }): Promise<UserAccountDb> {
    const [inserted] = await this.db('user_account')
      .insert(data)
      .returning('*');
    return inserted;
  }

  async createAuth(data: {
    user_account_id: string;
    password_salt: string;
    password_hash: string;
  }): Promise<void> {
    await this.db('user_auth').insert(data);
  }

  async getAuthDetails(userAccountId: string): Promise<{ password_salt: string; password_hash: string } | undefined> {
    return this.db('user_auth').where({ user_account_id: userAccountId }).first();
  }

  async createOtp(email: string, code: string, expiresAt: Date): Promise<void> {
    await this.db('user_otp_codes').insert({
      email,
      otp_code: code,
      expires_at: expiresAt,
      attempts: 0,
      is_consumed: false,
    });
  }

  async findOtpByEmail(email: string): Promise<any> {
    return this.db('user_otp_codes')
      .where({ email })
      .orderBy('created_at', 'desc')
      .first();
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await this.db('user_otp_codes')
      .where({ id })
      .increment('attempts', 1)
      .update({ last_attempt_at: new Date() });
  }

  async consumeOtp(id: string): Promise<void> {
    await this.db('user_otp_codes').where({ id }).update({ is_consumed: true });
  }

  async verifyUserEmail(email: string): Promise<void> {
    await this.db('user_account').where({ email }).update({ is_verified: true });
  }
}
