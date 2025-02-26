import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ movies: Movie[]; total: number }> {
    const skip = (page - 1) * limit;
    const [movies, total] = await Promise.all([
      this.movieModel.find()
        .sort({ sequentialId: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments(),
    ]);

    return { movies, total };
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.movieModel.findOne({ id }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async findByGenre(genreId: number, page = 1, limit = 20): Promise<{ movies: Movie[]; total: number }> {
    const skip = (page - 1) * limit;
    const [movies, total] = await Promise.all([
      this.movieModel.find({ genre_ids: genreId })
        .sort({ sequentialId: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments({ genre_ids: genreId }),
    ]);

    return { movies, total };
  }

  async search(query: string, page = 1, limit = 20): Promise<{ movies: Movie[]; total: number }> {
    const searchRegex = new RegExp(query, 'i');
    const skip = (page - 1) * limit;
    const [movies, total] = await Promise.all([
      this.movieModel.find({
        $or: [
          { title: searchRegex },
          { overview: searchRegex },
        ],
      })
        .sort({ sequentialId: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.movieModel.countDocuments({
        $or: [
          { title: searchRegex },
          { overview: searchRegex },
        ],
      }),
    ]);

    return { movies, total };
  }

  async hasAny(): Promise<boolean> {
    return (await this.movieModel.countDocuments().exec()) > 0;
  }

  async hasAnyRatings(): Promise<boolean> {
    // This would need to be implemented based on your rating system
    return true;
  }

  async findOne(movieId: number) {
    return this.movieModel.findOne({ id: movieId });
  }
}