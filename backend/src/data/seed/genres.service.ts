import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre } from '../../genre/genre.schema';

// TODO: consider downloading genres from TMDB to ensure our genres have the correct ids

@Injectable()
export class GenresSeederService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
  ) {}

  async generate(): Promise<void> {
    if (await this.genreModel.exists({})) {
      console.log('Genres already exist in database, skipping');
      return;
    }

    const genres: Partial<Genre>[] = [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
      { id: 3, name: 'Drama' },
      { id: 4, name: 'Horror' },
      { id: 5, name: 'Romance' },
      { id: 6, name: 'Thriller' },
      { id: 7, name: 'Science Fiction' },
      { id: 8, name: 'Fantasy' },
    ];

    console.log(`Inserting ${genres.length} genres into database`);
    await this.genreModel.insertMany(genres, { ordered: false });
    console.log('Genres inserted');
  }
} 