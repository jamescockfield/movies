import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../../movie/movie.schema';
import { Genre } from '../../genre/genre.schema';
import { TmdbService } from '../tmdb.service';

@Injectable()
export class MoviesSeederService {
  private readonly moviesPerGenre = 100;
  private readonly maxPages = 20; // Increased to ensure we can find enough unique movies

  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
    @Inject(TmdbService) private readonly tmdb: TmdbService
  ) {}

  async generate(): Promise<void> {
    if (await this.movieModel.exists({})) {
      console.log('Movies already exist in database, skipping');
      return;
    }

    const genres = await this.genreModel.find().lean().exec();
    const movies: Partial<Movie>[] = [];
    let sequentialId = 1;
    
    // Track movies that have already been added by TMDB ID
    const addedMovieIds = new Set<number>();

    for (const genre of genres) {
      console.log(`Downloading movies for genre: ${genre.name}`);
      const genreMovies = await this.downloadMoviesForGenre(genre.id, addedMovieIds);
      
      // Map TMDB movies to our movie schema
      const mappedMovies = genreMovies.map(tmdbMovie => {
        // Add this movie's ID to our tracking set
        if (tmdbMovie.id !== undefined) {
          addedMovieIds.add(tmdbMovie.id);
        }
        
        return {
          sequentialId: sequentialId++,
          title: tmdbMovie.title,
          genreId: genre.id,
          release_date: tmdbMovie.release_date,
          overview: tmdbMovie.overview,
          poster_path: tmdbMovie.poster_path,
          tmdb_id: tmdbMovie.id,
          vote_average: tmdbMovie.vote_average,
        };
      });

      movies.push(...mappedMovies);
    }

    await this.movieModel.insertMany(movies, { ordered: false });

    console.log(`Inserted ${movies.length} movies into database`);
  }

  private async downloadMoviesForGenre(genreId: number, existingMovieIds: Set<number>): Promise<any[]> {
    const uniqueMovies: any[] = [];
    
    for (let page = 1; page <= this.maxPages; page++) {
      if (uniqueMovies.length >= this.moviesPerGenre) {
        break;
      }
      
      const response = await this.tmdb.client.discoverMovie({
        with_genres: genreId.toString(),
        page,
        sort_by: 'popularity.desc',
        include_adult: false,
        'vote_count.gte': 100, // Only get movies with at least 100 votes
      });

      if (!response.results) {
        throw new Error(`Failed to fetch movies for genre ${genreId}`);
      }

      // Filter out movies that have already been added
      const newUniqueMovies = response.results.filter(movie => 
        movie.id !== undefined && !existingMovieIds.has(movie.id)
      );
      uniqueMovies.push(...newUniqueMovies);

      // If we've reached the last page but still don't have enough movies, we'll have to settle for fewer
      if (page === this.maxPages && uniqueMovies.length < this.moviesPerGenre) {
        console.warn(`Could only find ${uniqueMovies.length} unique movies for genre ${genreId} after checking ${this.maxPages} pages`);
      }
    }

    // Take only the first moviesPerGenre unique movies
    return uniqueMovies.slice(0, this.moviesPerGenre);
  }
} 