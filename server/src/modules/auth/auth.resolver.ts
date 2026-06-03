import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { LoginResult } from './dto/login.result';
import { BaseResult } from './types/shared.type';
import { SignupSchema } from './schema/signup.schema';
import { LoginSchema } from './schema/login.schema';
import { VerifyEmailSchema } from './schema/verify-email.schema';
import { ForgotPasswordSchema } from './schema/forgot-password.schema';
import { ResetPasswordSchema } from './schema/reset-password.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UserAccountRepository } from './repositories/user-account.repository';
import { SignupUseCase } from './use-cases/signup.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { VerifyEmailUseCase } from './use-cases/verify-email.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';
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

    @Mutation(() => LoginResult, { description: 'Log in to a customer account' })
    async login(
        @Args('input', new ZodValidationPipe(LoginSchema)) input: LoginInput,
        @Context() context: { res: Response }
    ): Promise<LoginResult> {
        try {
            const user = await this.dbService.runUnitOfWork({
                useTransaction: false,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new LoginUseCase({ userAccountRepo, authService: this.authService });
                    return await useCase.execute({ data: input, res: context.res });
                },
            });

            const successResponse = this.responseService.success('Logged in successfully.', StatusCode.SUCCESS);
            return {
                ...successResponse,
                roleCode: user.role_code,
            };
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

    @Mutation(() => BaseResult, { description: 'Request a password reset code to be sent to the email address' })
    async forgotPassword(
        @Args('input', new ZodValidationPipe(ForgotPasswordSchema)) input: ForgotPasswordInput
    ): Promise<BaseResult> {
        try {
            await this.dbService.runUnitOfWork({
                useTransaction: false,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new ForgotPasswordUseCase({ userAccountRepo, emailService: this.emailService });
                    return await useCase.execute({ data: input });
                },
            });

            return this.responseService.success(
                'If an account is associated with this email, a password reset code has been sent.',
                StatusCode.SUCCESS
            );
        } catch (error) {
            throw mapToHttpException(error);
        }
    }

    @Mutation(() => BaseResult, { description: 'Reset password using the received OTP code' })
    async resetPassword(
        @Args('input', new ZodValidationPipe(ResetPasswordSchema)) input: ResetPasswordInput
    ): Promise<BaseResult> {
        try {
            await this.dbService.runUnitOfWork({
                useTransaction: true,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new ResetPasswordUseCase({
                        userAccountRepo,
                        configService: this.configService,
                        emailService: this.emailService,
                    });
                    return await useCase.execute({ data: input });
                },
            });

            return this.responseService.success('Your password has been successfully reset. You can now log in with your new password.', StatusCode.SUCCESS);
        } catch (error) {
            throw mapToHttpException(error);
        }
    }

    @Mutation(() => BaseResult, { description: 'Log out from the current user session' })
    async logout(
        @Context() context: { res: Response }
    ): Promise<BaseResult> {
        try {
            this.authService.clearAuthCookie(context.res);
            return this.responseService.success('Logged out successfully.', StatusCode.SUCCESS);
        } catch (error) {
            throw mapToHttpException(error);
        }
    }
}
