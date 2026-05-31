import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { VenuesService } from './venues.service';
import { Venue } from './venue.entity';

@Resolver(() => Venue)
export class VenuesResolver {
  constructor(private readonly venuesService: VenuesService) {}

  @Query(() => [Venue], { name: 'venues', description: 'Retrieve a list of all venues with optional filters' })
  async getVenues(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('type', { type: () => String, nullable: true }) type?: string,
  ): Promise<Venue[]> {
    return this.venuesService.findAll(search, type);
  }

  @Query(() => Venue, { name: 'venue', nullable: true, description: 'Retrieve a single venue by its UUID' })
  async getVenueById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Venue | null> {
    return this.venuesService.findById(id);
  }
}
