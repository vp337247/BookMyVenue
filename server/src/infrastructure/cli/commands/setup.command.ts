import { Command, CommandRunner } from 'nest-commander';
import * as inquirer from 'inquirer';
import { hashPassword } from '../../../common/utils/password.util';
import { DatabaseService } from '../../database/database.service';

@Command({
  name: 'setup-admin',
  description: 'Interactive system administrator setup wizard',
})
export class SetupAdminCommand extends CommandRunner {
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

    const { firstName, lastName, email, password } = answers;

    try {
      await this.databaseService.runUnitOfWork({
        useTransaction: true,
        buildDependencies: async () => ({}),
        callback: async ({ db }) => {
          // 1. Check if ADMIN role exists
          const adminRole = await db('roles').where({ code: 'ADMIN' }).first();
          if (!adminRole) {
            throw new Error('Roles table is not seeded. Please run migrations and seeds first: npm run db:seed');
          }

          // 2. Check if Email already exists
          const existingUser = await db('user_account').where({ email }).first();
          if (existingUser) {
            throw new Error(`A user account with email "${email}" already exists.`);
          }

          // 3. Hash the password using our built-in crypto PBKDF2 utility
          const { salt, hash } = hashPassword(password);

          // 4. Run database transaction to insert account and auth
          const [account] = await db('user_account').insert({
            email,
            first_name: firstName,
            last_name: lastName || null,
            role_id: adminRole.id,
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
      console.log(`👤 Name: ${firstName} ${lastName || ''}\n`);

    } catch (error) {
      console.error('❌ Onboarding failed:', error.message);
    }
  }
}
