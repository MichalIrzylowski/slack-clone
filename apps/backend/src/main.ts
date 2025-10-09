import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { runSeedOnBootstrap } from './seed/seed';

async function bootstrap() {
  dotenv.config({ path: join(__dirname, '../.env') });

  await runSeedOnBootstrap();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
