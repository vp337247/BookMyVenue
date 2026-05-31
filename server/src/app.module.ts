import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { VenuesModule } from './venues/venues.module';
import { SetupAdminCommand } from './infrastructure/cli/commands/setup.command';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    VenuesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),
  ],
  providers: [SetupAdminCommand],
})
export class AppModule {}

