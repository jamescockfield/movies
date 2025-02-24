import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Recommender')
@Controller('recommender')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get('similar/:movieId')
  @ApiOperation({ summary: 'Get similar movies based on a movie ID' })
  @ApiResponse({ status: 200, description: 'Returns list of similar movies' })
  async getSimilarMovies(
    @Param('movieId') movieId: string,
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getSimilarMovies(movieId, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('personalized')
  @ApiOperation({ summary: 'Get personalized movie recommendations for the user' })
  @ApiResponse({ status: 200, description: 'Returns personalized movie recommendations' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPersonalizedRecommendations(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getPersonalizedRecommendations(limit);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending movies' })
  @ApiResponse({ status: 200, description: 'Returns trending movies' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTrendingMovies(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getTrendingMovies(limit);
  }

  @Get('genre/:genreId')
  @ApiOperation({ summary: 'Get movie recommendations by genre' })
  @ApiResponse({ status: 200, description: 'Returns movies by genre' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecommendationsByGenre(
    @Param('genreId') genreId: string,
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getRecommendationsByGenre(genreId, limit);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated movies' })
  @ApiResponse({ status: 200, description: 'Returns top rated movies' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopRatedMovies(
    @Query('limit') limit: number = 10
  ) {
    return this.recommenderService.getTopRatedMovies(limit);
  }
}
