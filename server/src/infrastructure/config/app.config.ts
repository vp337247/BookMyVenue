import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => {
  return {
    host: process.env.APP_HOST,
    port: parseInt(process.env.APP_PORT, 10),
  };
});
