import { Injectable } from '@nestjs/common';
import { MovieRecommenderManager } from './MovieRecommenderManager';
import { MovieService } from '../movie/movie.service';
import { MovieRatingService } from '../movie-rating/movie-rating.service';

@Injectable()
export class RecommenderService {
  constructor(
    private readonly recommenderManager: MovieRecommenderManager,
    private readonly movieService: MovieService,
    private readonly movieRatingService: MovieRatingService,
  ) {}

  async seedModel() {
    if (await this.modelExists()) {
      console.log('Model already exists');
      return;
    }

    await this.recommenderManager.init();
    await this.recommenderManager.train();
    await this.recommenderManager.saveModel();
  }

  async modelExists(): Promise<boolean> {
    return this.recommenderManager.modelExists();
  }

  async getSimilarMovies(movieId: string, limit: number = 10) {
    const allMovies = await this.movieService.findAll();
    const targetMovie = allMovies.movies.find(m => m.id === parseInt(movieId));
    
    if (!targetMovie) {
      throw new Error('Movie not found');
    }

    // Get movies with similar genres
    const similarMovies = allMovies.movies
      .filter(m => m.id !== targetMovie.id)
      .map(movie => ({
        ...movie,
        similarity: this.calculateGenreSimilarity(targetMovie.genre_ids, movie.genre_ids)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarMovies;
  }

  async getPersonalizedRecommendations(userId: number, limit: number = 10) {
    return this.recommenderManager.recommend(userId);
  }

  async getTrendingMovies(limit: number = 10) {
    const recentRatings = await this.movieRatingService.getRecentRatings();
    
    // Group ratings by movie and calculate average rating and rating count
    const movieScores = new Map();
    recentRatings.forEach(rating => {
      if (!movieScores.has(rating.movieId)) {
        movieScores.set(rating.movieId, {
          movieId: rating.movieId,
          totalRating: 0,
          count: 0
        });
      }
      const score = movieScores.get(rating.movieId);
      score.totalRating += rating.rating;
      score.count += 1;
    });

    // Calculate trending score (average rating * log(number of ratings))
    const trendingMovies = Array.from(movieScores.values())
      .map(score => ({
        movieId: score.movieId,
        trendingScore: (score.totalRating / score.count) * Math.log10(score.count + 1)
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    // Fetch full movie details
    const movieDetails = await Promise.all(
      trendingMovies.map(movie => this.movieService.findOne(movie.movieId))
    );

    return movieDetails;
  }

  async getRecommendationsByGenre(genreId: string, limit: number = 10) {
    const allMovies = await this.movieService.findAll();
    
    const moviesInGenre = allMovies.movies
      .filter(movie => movie.genre_ids.includes(parseInt(genreId)))
      .slice(0, limit);

    return moviesInGenre;
  }

  async getTopRatedMovies(limit: number = 10) {
    const allRatings = await this.movieRatingService.findAll();
    
    // Calculate average ratings
    const movieRatings = new Map();
    allRatings.forEach(rating => {
      if (!movieRatings.has(rating.movieId)) {
        movieRatings.set(rating.movieId, {
          movieId: rating.movieId,
          totalRating: 0,
          count: 0
        });
      }
      const score = movieRatings.get(rating.movieId);
      score.totalRating += rating.rating;
      score.count += 1;
    });

    // Sort by average rating (minimum 5 ratings)
    const topRated = Array.from(movieRatings.values())
      .filter(score => score.count >= 5)
      .map(score => ({
        movieId: score.movieId,
        averageRating: score.totalRating / score.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    // Fetch full movie details
    const movieDetails = await Promise.all(
      topRated.map(movie => this.movieService.findOne(movie.movieId))
    );

    return movieDetails;
  }

  private calculateGenreSimilarity(genres1: number[], genres2: number[]): number {
    const set1 = new Set(genres1);
    const set2 = new Set(genres2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }
} 