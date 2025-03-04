import { Controller, Post, Get, Body, Param, Request, Inject } from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';

@Controller('movie-ratings')
export class MovieRatingController {
  constructor(@Inject(MovieRatingService) private readonly movieRatingService: MovieRatingService) {}

  @Post(':movieId')
  async rateMovie(
    @Request() req: any, // TODO: Fix any
    @Param('movieId') movieId: string,
    @Body('rating') rating: number,
  ) {
    return this.movieRatingService.create(
      req.user.id,
      movieId,
      rating,
    );
  }

  @Get('user')
  async getUserRatings(@Request() req: any) { // TODO: Fix any
    return this.movieRatingService.findByUser(req.user.id);
  }

  @Get('user/:userId')
  async getUserRatingsByUserId(@Param('userId') userId: string) {
    return this.movieRatingService.findByUser(userId);
  }

  @Get('movie/:movieId')
  async getMovieRatings(@Param('movieId') movieId: string) {
    return this.movieRatingService.findByMovie(movieId);
  }

  @Get('movie/:movieId/average')
  async getMovieAverageRating(@Param('movieId') movieId: string) {
    return {
      averageRating: await this.movieRatingService.getAverageRating(movieId),
    };
  }
}