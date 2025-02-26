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
    TmdbService,
    GenresSeederService,
    UsersSeederService,
    MoviesSeederService,
    MovieRatingsSeederService,
    RecommenderService,
    SeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {}