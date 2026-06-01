import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_FILTER } from '@nestjs/core';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from './infrastructure/config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { VenuesModule } from './venues/venues.module';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQlExceptionFilter } from './common/filters/graphql-exception.filter';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    VenuesModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }), // Essential for read/write access to HTTP-only cookies and sessions!
      playground: false, // Disables the older, classic playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Enforces Apollo Sandbox as the default interface
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphQlExceptionFilter,
    },
  ],
})
export class AppModule { }


