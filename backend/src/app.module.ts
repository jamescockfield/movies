import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { RecommenderModule } from './recommender/recommender.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    GenreModule,
    MovieModule,
    RecommenderModule,
    SeedModule,
  ],
})
export class AppModule {}