import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyEmailInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  otpCode: string;
}
