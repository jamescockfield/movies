import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const PORT = parseInt(process.env.PORT || '3000');
  const HOST = process.env.HOST || '0.0.0.0';
  
  await app.listen(PORT, HOST);
  console.log(`Server running on port ${PORT}`);
}

bootstrap();