import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Response } from 'express';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { BaseResult } from './types/shared.type';
import { SignupSchema } from './schema/signup.schema';
import { LoginSchema } from './schema/login.schema';
import { ValidationException, formatZodErrors } from '../../common/utils/validation.util';
import { UserAccountRepository } from './repositories/user-account.repository';
import { SignupUseCase } from './use-cases/signup.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { mapToHttpException } from '../../common/utils/exception-mapper.util';
import { ResponseService } from '../../common/services/response.service';
import { StatusCode } from '../../common/enums/status-code.enum';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly responseService: ResponseService,
        private readonly authService: AuthService
    ) { }

    @Mutation(() => BaseResult, { description: 'Sign up a new customer account' })
    async signUp(@Args('input') input: SignupInput): Promise<BaseResult> {
        const validation = SignupSchema.safeParse(input);
        if (!validation.success) {
            throw new ValidationException(
                'Input validation failed',
                formatZodErrors(validation.error.issues)
            );
        }

        try {
            await this.dbService.runUnitOfWork({
                useTransaction: true,
                buildDependencies: async ({ db }) => ({
                    userAccountRepo: new UserAccountRepository(db),
                }),
                callback: async ({ userAccountRepo }) => {
                    const useCase = new SignupUseCase({ userAccountRepo });
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
        @Args('input') input: LoginInput,
        @Context() context: { res: Response }
    ): Promise<BaseResult> {
        const validation = LoginSchema.safeParse(input);
        if (!validation.success) {
            throw new ValidationException(
                'Input validation failed',
                formatZodErrors(validation.error.issues)
            );
        }

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
}
