import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('Starting server...');

  const app = await NestFactory.create(AppModule);

  console.log('App created');

  const seedService = app.get(SeedService);
  if (!(await seedService.checkSeeded())) {
    console.log('Seeding was not completed. Please run `npm run seed` before starting the server');
    process.exit(1);
  }

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const configService = app.get(ConfigService);
  const { port, host } = configService.config.server;
  
  await app.listen(port, host);
  console.log(`Server running on port ${port}`);
}

bootstrap();