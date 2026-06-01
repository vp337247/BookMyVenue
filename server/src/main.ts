import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register cookie parser middleware
  app.use(cookieParser());

  // Enable CORS for frontend client integration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Retrieve configuration service to dynamically read application port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  await app.listen(port);
}
bootstrap();

