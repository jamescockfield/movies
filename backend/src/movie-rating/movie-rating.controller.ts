import { Controller, Post, Get, Body, Param, Request, Inject } from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';
import { RequestWithUser } from '@/types/types';

@Controller('movie-ratings')
export class MovieRatingController {
  constructor(@Inject(MovieRatingService) private readonly movieRatingService: MovieRatingService) {}

  @Get('user/:userId')
  async getRatingsByUserId(@Param('userId') userId: string) {
    return this.movieRatingService.findByUser(userId);
  }

  @Get('movie/:movieId')
  async getRatingsByMovieId(@Param('movieId') movieId: string) {
    return this.movieRatingService.findByMovie(movieId);
  }

  @Get('movie/:movieId/average')
  async getAverageRating(@Param('movieId') movieId: string) {
    return {
      averageRating: await this.movieRatingService.getAverageRating(movieId),
    };
  }

  @Post(':movieId')
  async rateMovie(
    @Request() req: RequestWithUser,
    @Param('movieId') movieId: string,
    @Body('rating') rating: number,
  ) {
    return this.movieRatingService.create(
      req.user.id,
      movieId,
      rating,
    );
  }
}