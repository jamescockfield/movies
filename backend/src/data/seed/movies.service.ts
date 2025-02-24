import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../../movie/movie.schema';
import { Genre } from '../../genre/genre.schema';

@Injectable()
export class MoviesSeederService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  // TODO: consider downloading movies from TMDB instead of randomly generating them

  async generate(): Promise<void> {
    if (await this.movieModel.exists({})) {
      console.log('Movies already exist in database, skipping');
      return;
    }

    const genres = await this.genreModel.find().lean().exec();
    const movies: Partial<Movie>[] = [];
    let sequentialId = 1;

    for (const genre of genres) {
      for (let i = 1; i <= 50; i++) {
        movies.push({
          sequentialId: sequentialId++,
          title: `${genre.name} Movie ${i}`,
          genreId: genre.id,
          release_date: `${Math.floor(Math.random() * (2024 - 1990) + 1990)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-${String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0')}`,
        });
      }
    }

    console.log(`Inserting ${movies.length} movies into database`);
    await this.movieModel.insertMany(movies, { ordered: false });
    console.log('Movies inserted');
  }
} 