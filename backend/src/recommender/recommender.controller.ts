import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { RecommenderService } from './recommender.service';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get('personalized')
  async getPersonalizedRecommendations(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getPersonalizedRecommendations(limit);
  }

  @Get('trending')
  async getTrendingMovies(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getTrendingMovies(limit);
  }

  @Get('top-rated')
  async getTopRatedMovies(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getTopRatedMovies(limit);
  }

  @Get('genre/:genreId')
  async getRecommendationsByGenre(
    @Param('genreId') genreId: string,
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getRecommendationsByGenre(genreId, limit);
  }

  @Get('similar/:movieId')
  async getSimilarMovies(
    @Param('movieId') movieId: string,
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getSimilarMovies(movieId, limit);
  }
}
