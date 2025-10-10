import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { runSeedOnBootstrap } from './seed/seed';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config({ path: join(__dirname, '../.env') });

  await runSeedOnBootstrap();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
