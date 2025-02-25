import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { Genre, GenreSchema } from '../genre/genre.schema';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { MovieRating, MovieRatingSchema } from '../movie-rating/movie-rating.schema';
import { MovieRatingsSeederService } from './movie-ratings.service';
import { UsersSeederService } from './users.service';
import { GenresSeederService } from './genres.service';
import { MoviesSeederService } from './movies.service';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';
import { RecommenderService } from '../recommender/recommender.service';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
      cache: false,
      validate: (config: Record<string, unknown>) => {
        const required = ['MONGODB_URI', 'TMDB_API_KEY'];
        for (const key of required) {
          console.log('key: ', config[key]);
          if (!config[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
          }
        }
        return config;
      },
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: MovieRating.name, schema: MovieRatingSchema },
    ]),
  ],
  providers: [
    {
      provide: TmdbService,
      useClass: TmdbService,
    },
    {
      provide: GenresSeederService,
      useClass: GenresSeederService,
    },
    {
      provide: UsersSeederService,
      useClass: UsersSeederService,
    },
    {
      provide: MoviesSeederService,
      useClass: MoviesSeederService,
    },
    {
      provide: MovieRatingsSeederService,
      useClass: MovieRatingsSeederService,
    },
    {
      provide: RecommenderService,
      useClass: RecommenderService,
    },
    {
      provide: SeedService,
      useClass: SeedService,
    },
  ],
  exports: [SeedService],
})
export class SeedModule {}