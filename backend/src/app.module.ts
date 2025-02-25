import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { RecommenderModule } from './recommender/recommender.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    DatabaseModule,
    MovieModule,
    UserModule,
    RecommenderModule,
    GenreModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule {}