import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../infrastructure/database/database.service';
import { Venue, mapDbVenueToEntity } from './venue.entity';

@Injectable()
export class VenuesService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  async findAll(search?: string, type?: string): Promise<Venue[]> {
    let query = this.databaseService.connection('venues').select('*');

    if (search) {
      query = query.where((builder) => {
        builder.where('name', 'ILIKE', `%${search}%`)
               .orWhere('location', 'ILIKE', `%${search}%`)
               .orWhere('description', 'ILIKE', `%${search}%`);
      });
    }

    if (type) {
      query = query.where('type', type);
    }

    const rows = await query;
    return rows.map(mapDbVenueToEntity).filter(Boolean) as Venue[];
  }

  async findById(id: string): Promise<Venue | null> {
    const row = await this.databaseService.connection('venues').where({ id }).first();
    return mapDbVenueToEntity(row);
  }
}

