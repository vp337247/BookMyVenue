import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as path from 'path';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
  ],
})
export class ConfigModule {}

export async function getConfigService(): Promise<ConfigService> {
  const app = await NestFactory.createApplicationContext(ConfigModule, { logger: false });
  return app.get(ConfigService);
}
