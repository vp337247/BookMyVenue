import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { BaseResult } from './types/shared.type';
import { SignupSchema } from './schema/signup.schema';
import { LoginSchema } from './schema/login.schema';
import { VerifyEmailSchema } from './schema/verify-email.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UserAccountRepository } from './repositories/user-account.repository';
import { SignupUseCase } from './use-cases/signup.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { mapToHttpException } from '../../common/utils/exception-mapper.util';
import { ResponseService } from '../../common/services/response.service';
import { StatusCode } from '../../common/enums/status-code.enum';
import { AuthService } from './auth.service';
import { EmailService } from '../../common/services/email.service';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly responseService: ResponseService,
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService
    ) { }

    @Mutation(() => BaseResult, { description: 'Sign up a new customer account' })
    async signUp(
        @Args('input', new ZodValidationPipe(SignupSchema)) input: SignupInput
    ): Promise<BaseResult> {
        try {
            await this.dbService.runUnitOfWork({
                useTransaction: true,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new SignupUseCase({ userAccountRepo, emailService: this.emailService });
                    return await useCase.execute({ data: input });
                },
            });

            return this.responseService.success('Your account has been created successfully.', StatusCode.CREATED);
        } catch (error) {
            throw mapToHttpException(error);
        }
    }

    @Mutation(() => BaseResult, { description: 'Log in to a customer account' })
    async login(
        @Args('input', new ZodValidationPipe(LoginSchema)) input: LoginInput,
        @Context() context: { res: Response }
    ): Promise<BaseResult> {
        try {
            await this.dbService.runUnitOfWork({
                useTransaction: false,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new LoginUseCase({ userAccountRepo, authService: this.authService });
                    return await useCase.execute({ data: input, res: context.res });
                },
            });

            return this.responseService.success('Logged in successfully.', StatusCode.SUCCESS);
        } catch (error) {
            throw mapToHttpException(error);
        }
    }

    @Mutation(() => BaseResult, { description: 'Verify customer account email address using the received OTP' })
    async verifyEmail(
        @Args('input', new ZodValidationPipe(VerifyEmailSchema)) input: VerifyEmailInput
    ): Promise<BaseResult> {
        try {
            await this.dbService.runUnitOfWork({
                useTransaction: false,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new VerifyEmailUseCase({ userAccountRepo, configService: this.configService });
                    return await useCase.execute({ data: input });
                },
            });

            return this.responseService.success('Your email address has been verified successfully. You can now log in.', StatusCode.SUCCESS);
        } catch (error) {
            throw mapToHttpException(error);
        }
    }
}
