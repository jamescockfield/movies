import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { Genre, GenreSchema } from '../genre/genre.schema';
import { Movie, MovieSchema } from '../movie/movie.schema';
import { MovieRating, MovieRatingSchema } from '../movie-rating/movie-rating.schema';
import { SeedService } from './seed.service';
import { DatabaseModule } from '../database/database.module';
import { TmdbService } from './tmdb.service';
import { ConfigModule } from '../config/config.module';
import { RecommenderModule } from '../recommender/recommender.module';
import { MovieRatingsSeederService } from './seeders/movie-ratings-seeder.service';
import { UsersSeederService } from './seeders/users-seeder.service';
import { GenresSeederService } from './seeders/genres-seeder.service';
import { MoviesSeederService } from './seeders/movies-seeder.service';

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