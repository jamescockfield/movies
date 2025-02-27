import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalGuards(new JwtAuthGuard());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  console.log('Checking if database is seeded...');

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