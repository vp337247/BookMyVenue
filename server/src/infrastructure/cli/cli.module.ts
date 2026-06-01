import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { InitCommand } from './commands/init.command';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
    ],
    providers: [InitCommand],
})
export class CliModule { }