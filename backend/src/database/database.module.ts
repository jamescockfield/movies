import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('MongoDB URI available:', uri);
        if (!uri) {
          console.error('MONGODB_URI is not defined in environment variables');
        }
        return {
          uri
        };
      }
    })
  ]
})
export class DatabaseModule {} 