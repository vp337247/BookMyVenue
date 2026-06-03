import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  countryCode?: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  roleCode: string;
}
