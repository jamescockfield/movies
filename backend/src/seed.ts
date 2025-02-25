import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    await app.close();
    process.exit(1);
  }

  await app.close();
}

bootstrap();