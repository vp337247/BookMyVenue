import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResult } from '../types/shared.type';

@ObjectType()
export class LoginResult extends BaseResult {
  @Field(() => String, { nullable: true })
  roleCode?: string;
}
