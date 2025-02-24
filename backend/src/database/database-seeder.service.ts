import { Injectable } from '@nestjs/common';
import { MovieService } from '../movie/movie.service';
import { UserService } from '../user/user.service';
import { GenreService } from '../genre/genre.service';
import { MovieRecommenderManager } from '../recommender/MovieRecommenderManager';

@Injectable()
export class DatabaseSeederService {
  constructor(
    private movieService: MovieService,
    private userService: UserService,
    private genreService: GenreService,
    private recommenderManager: MovieRecommenderManager,
  ) {}

  async checkSeeded(): Promise<boolean> {
    const [hasGenres, hasMovies, hasUsers, hasRatings] = await Promise.all([
      this.genreService.hasAny(),
      this.movieService.hasAny(),
      this.userService.hasAny(),
      this.movieService.hasAnyRatings(),
    ]);

    return (
      hasGenres &&
      hasMovies && 
      hasUsers &&
      hasRatings &&
      this.recommenderManager.modelExists()
    );
  }
}