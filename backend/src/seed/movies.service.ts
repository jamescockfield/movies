import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../movie/movie.schema';
import { Genre } from '../genre/genre.schema';
import { MovieDb } from 'moviedb-promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesSeederService {
  private movieDb: MovieDb;
  private readonly moviesPerGenre = 100;
  private readonly maxPages = 5; // TMDB returns 20 movies per page, so 5 pages = 100 movies

  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
    private configService: ConfigService,
  ) {
    this.movieDb = new MovieDb(this.configService.get('TMDB_API_KEY')!);
  }

  async generate(): Promise<void> {
    if (await this.movieModel.exists({})) {
      console.log('Movies already exist in database, skipping');
      return;
    }

    const genres = await this.genreModel.find().lean().exec();
    const movies: Partial<Movie>[] = [];
    let sequentialId = 1;

    for (const genre of genres) {
      console.log(`Downloading movies for genre: ${genre.name}`);
      const genreMovies = await this.downloadMoviesForGenre(genre.id);
      
      // Map TMDB movies to our movie schema
      const mappedMovies = genreMovies.map(tmdbMovie => ({
        sequentialId: sequentialId++,
        title: tmdbMovie.title,
        genreId: genre.id,
        release_date: tmdbMovie.release_date,
        overview: tmdbMovie.overview,
        poster_path: tmdbMovie.poster_path,
        tmdb_id: tmdbMovie.id,
        vote_average: tmdbMovie.vote_average,
      }));

      movies.push(...mappedMovies);
    }

    console.log(`Inserting ${movies.length} movies into database`);
    await this.movieModel.insertMany(movies, { ordered: false });
    console.log('Movies inserted');
  }

  private async downloadMoviesForGenre(genreId: number): Promise<any[]> {
    const allMovies: any[] = [];
    
    for (let page = 1; page <= this.maxPages; page++) {
      const response = await this.movieDb.discoverMovie({
        with_genres: genreId.toString(),
        page,
        sort_by: 'popularity.desc',
        include_adult: false,
        'vote_count.gte': 100, // Only get movies with at least 100 votes
      });

      if (!response.results) {
        throw new Error(`Failed to fetch movies for genre ${genreId}`);
      }

      allMovies.push(...response.results);

      if (allMovies.length >= this.moviesPerGenre) {
        break;
      }
    }

    // Take only the first moviesPerGenre movies
    return allMovies.slice(0, this.moviesPerGenre);
  }
} 