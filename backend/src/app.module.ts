import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { RecommenderModule } from './recommender/recommender.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './data/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    MovieModule,
    UserModule,
    RecommenderModule,
    GenreModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule {}