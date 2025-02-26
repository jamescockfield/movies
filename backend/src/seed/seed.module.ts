import { Module } from '@nestjs/common';
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
import { TmdbService } from './tmdb.service';
import { ConfigModule } from '../config/config.module';
import { RecommenderModule } from '../recommender/recommender.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Genre.name, schema: GenreSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: MovieRating.name, schema: MovieRatingSchema },
    ]),
    RecommenderModule,
  ],
  providers: [
    TmdbService,
    GenresSeederService,
    UsersSeederService,
    MoviesSeederService,
    MovieRatingsSeederService,
    SeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {}