import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResult } from '../types/shared.type';

@ObjectType()
export class UserProfile {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String)
  roleCode: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  countryCode?: string;
}

@ObjectType()
export class SignupResult extends BaseResult {
  @Field(() => UserProfile, { nullable: true })
  user?: UserProfile;
}
