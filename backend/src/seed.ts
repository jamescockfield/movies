import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const command = process.argv[2];
    
    if (command === 'seed') {
      const seedService = app.get(SeedService);
      await seedService.seed();
      console.log('Seeding completed successfully');
    } else {
      console.error('Unknown command:', command);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error executing command:', error);
    await app.close();
    process.exit(1);
  }

  await app.close();
}

bootstrap();