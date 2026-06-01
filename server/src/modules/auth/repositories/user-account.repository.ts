import { Knex } from 'knex';

export interface UserAccountDb {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  role_code: string;
  phone_number: string | null;
  country_code: string | null;
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
}
