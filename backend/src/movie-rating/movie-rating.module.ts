import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieRating, MovieRatingSchema } from './movie-rating.schema';
import { MovieRatingService } from './movie-rating.service';
import { MovieRatingController } from './movie-rating.controller';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MovieRating.name, schema: MovieRatingSchema },
    ]),
    MovieModule,
  ],
  providers: [MovieRatingService],
  controllers: [MovieRatingController],
  exports: [MovieRatingService],
})
export class MovieRatingModule {}