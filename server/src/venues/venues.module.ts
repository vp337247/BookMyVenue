import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesResolver } from './venues.resolver';

@Module({
  providers: [VenuesService, VenuesResolver],
  exports: [VenuesService],
})
export class VenuesModule {}
