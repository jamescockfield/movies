import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { RecommenderModule } from './recommender/recommender.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MovieModule,
    UserModule,
    RecommenderModule,
    GenreModule,
    AuthModule,
  ],
})
export class AppModule {}