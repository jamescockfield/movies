import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';

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

  const configService = app.get(ConfigService);
  const { port, host } = configService.config.server;
  
  await app.listen(port, host);
  console.log(`Server running on port ${port}`);
}

bootstrap();