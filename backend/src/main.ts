import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips non-whitelisted properties
    transform: true, // enables automatic transformation
    forbidNonWhitelisted: true, // throws error if non-whitelisted properties are present
  }));

  // Check if database is seeded
  const seedService = app.get(SeedService);
  if (!(await seedService.checkSeeded())) {
    console.log('Seeding was not completed. Please run `npm run seed` before starting the server');
    process.exit(1);
  }

  const PORT = parseInt(process.env.PORT || '3000');
  const HOST = process.env.HOST || '0.0.0.0';
  
  await app.listen(PORT, HOST);
  console.log(`Server running on port ${PORT}`);
}

bootstrap();