import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre } from '../genre/genre.schema';
import { genres } from '../genre/genres';
import { TmdbService } from './tmdb.service';

@Injectable()
export class GenresSeederService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
    @Inject(TmdbService) private readonly tmdb: TmdbService,
  ) {
    console.log('GenresSeederService being constructed');
  }

  async generate(): Promise<void> {
    if (await this.genreModel.exists({})) {
      console.log('Genres already exist in database, skipping');
      return;
    }

    console.log('Downloading genres from TMDB...');
    const response = await this.tmdb.client.genreMovieList();
    const tmdbGenres = response.genres;
    
    if (!tmdbGenres) {
      throw new Error('Failed to fetch genres from TMDB');
    }

    // Map our genre names to TMDB genres to get their IDs
    const genresToInsert = genres.map(genreName => {
      const tmdbGenre = tmdbGenres.find(g => g.name?.toLowerCase() === genreName.toLowerCase());
      if (!tmdbGenre) {
        throw new Error(`Could not find TMDB genre for: ${genreName}`);
      }
      return {
        id: tmdbGenre.id,
        name: tmdbGenre.name
      };
    });

    console.log(`Inserting ${genresToInsert.length} genres into database`);
    await this.genreModel.insertMany(genresToInsert, { ordered: false });
    console.log('Genres inserted');
  }
} 