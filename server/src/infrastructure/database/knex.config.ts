import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import * as path from 'path';

export function createKnexConfig(configService: ConfigService): Knex.Config {
  return {
    client: 'pg',
    connection: {
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      user: configService.get<string>('database.user'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.database'),
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, './migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds'),
      extension: 'ts',
    },
  };
}
