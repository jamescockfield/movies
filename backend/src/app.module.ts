import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MovieModule } from './movie/movie.module';
import { UserModule } from './user/user.module';
import { RecommenderModule } from './recommender/recommender.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
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