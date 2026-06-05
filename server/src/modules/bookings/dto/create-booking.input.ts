import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field(() => String)
  venueId: string;

  @Field(() => Date)
  startTime: Date;

  @Field(() => Date)
  endTime: Date;
}
