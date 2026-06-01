import { Command, CommandRunner } from 'nest-commander';
import * as inquirer from 'inquirer';
import { hashPassword } from '../../../common/utils/password.util';
import { DatabaseService } from '../../database/database.service';
import { UserRole } from '../../../common/enums/role.enum';

@Command({
  name: 'init',
  description: 'Initial BookMyVenue setup wizard',
})
export class InitCommand extends CommandRunner {
  constructor(
    private readonly databaseService: DatabaseService
  ) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    console.log('\n🌟 BookMyVenue Onboarding Wizard: System Administrator 🌟\n');

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter Admin First Name:',
        validate: (input) => (input.trim() ? true : 'First Name is required.'),
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter Admin Last Name (optional):',
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter Admin Email Address:',
        validate: (input) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input)) {
            return 'Please enter a valid email address.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'countryCode',
        message: 'Enter Admin Country Code (e.g. +1, +91):',
        validate: (input) => (input.trim() ? true : 'Country Code is required.'),
      },
      {
        type: 'input',
        name: 'phone',
        message: 'Enter Admin Phone Number:',
        validate: (input) => (input.trim() ? true : 'Phone Number is required.'),
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter Admin Password:',
        mask: '*',
        validate: (input) => {
          if (input.length < 8) {
            return 'Password must be at least 8 characters long.';
          }
          return true;
        },
      },
    ]);

    const { firstName, lastName, email, countryCode, phone, password } = answers;

    try {
      await this.databaseService.runUnitOfWork({
        useTransaction: true,
        buildDependencies: async () => ({}),
        callback: async ({ db }) => {
          // 1. Check if ADMIN role exists
          const adminRole = await db('roles').where({ code: UserRole.ADMIN }).first();
          if (!adminRole) {
            throw new Error('Roles table is not seeded. Please run migrations and seeds first: npm run db:seed');
          }

          // 2. Check if Email already exists
          const existingUser = await db('user_account').where({ email }).first();
          if (existingUser) {
            throw new Error(`A user account with email "${email}" already exists.`);
          }

          // 3. Check if Phone Number already exists
          const existingPhone = await db('user_account').where({ phone_number: phone }).first();
          if (existingPhone) {
            throw new Error(`A user account with phone number "${phone}" already exists.`);
          }

          // 4. Hash the password using our built-in crypto PBKDF2 utility
          const { salt, hash } = hashPassword(password);

          // 5. Run database transaction to insert account and auth
          const [account] = await db('user_account').insert({
            email,
            first_name: firstName,
            last_name: lastName || null,
            phone_number: phone,
            country_code: countryCode,
            role_code: adminRole.code,
          }).returning('*');

          await db('user_auth').insert({
            user_account_id: account.id,
            password_salt: salt,
            password_hash: hash,
          });
        },
      });

      console.log(`\n🎉 System Administrator account created successfully!`);
      console.log(`📧 Email: ${email}`);
      console.log(`📞 Phone: ${countryCode} ${phone}`);
      console.log(`👤 Name: ${firstName} ${lastName || ''}\n`);

    } catch (error) {
      console.error('❌ Onboarding failed:', error.message);
    }
  }
}
