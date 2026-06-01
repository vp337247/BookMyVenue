import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResult {
  @Field(() => Boolean, { defaultValue: true })
  success: boolean;

  @Field(() => String, { defaultValue: 'success' })
  message: string;

  @Field(() => Int, { defaultValue: 200 })
  statusCode: number;
}
