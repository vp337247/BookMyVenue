import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Venue {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  type: string;

  @Field()
  location: string;

  @Field(() => Float)
  pricePerHour: number;

  @Field(() => Int)
  capacity: number;

  @Field(() => [String])
  amenities: string[];

  @Field(() => [String])
  imageUrls: string[];

  @Field()
  ownerId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export function mapDbVenueToEntity(dbVenue: any): Venue | null {
  if (!dbVenue) return null;
  return {
    id: dbVenue.id,
    name: dbVenue.name,
    description: dbVenue.description,
    type: dbVenue.type,
    location: dbVenue.location,
    pricePerHour: Number(dbVenue.price_per_hour),
    capacity: Number(dbVenue.capacity),
    amenities: Array.isArray(dbVenue.amenities) ? dbVenue.amenities : JSON.parse(dbVenue.amenities || '[]'),
    imageUrls: Array.isArray(dbVenue.image_urls) ? dbVenue.image_urls : JSON.parse(dbVenue.image_urls || '[]'),
    ownerId: dbVenue.owner_id,
    createdAt: new Date(dbVenue.created_at),
    updatedAt: new Date(dbVenue.updated_at),
  };
}
