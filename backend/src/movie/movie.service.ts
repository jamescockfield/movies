import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './movie.schema';
import { Genre } from '@/genre/genre.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
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

  async findById(id: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ _id: new Types.ObjectId(id) }).exec();
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
          // { overview: searchRegex },
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
    return this.movieModel.findOne({ _id: new Types.ObjectId(movieId) });
  }

  /**
   * Finds movies by multiple genres and returns them grouped by genre
   * @param genreIds Array of genre IDs to filter by
   * @param moviesPerGenre Number of movies to return per genre
   * @returns Object with movies grouped by genre name
   */
  async findByGenres(genreIds: number[], moviesPerGenre: number): Promise<{ moviesByGenre: Record<string, any[]> }> {
    // First, get all genres to have the mapping between genre IDs and names
    const allGenres = await this.genreModel.find({ id: { $in: genreIds } }).exec();
    
    // Create a map of genre ID to genre name for easy lookup
    const genreMap = new Map<number, string>();
    allGenres.forEach(genre => {
      genreMap.set(genre.id, genre.name);
    });
    
    // Initialize result object with empty arrays for each genre
    const moviesByGenre: Record<string, any[]> = {};
    allGenres.forEach(genre => {
      moviesByGenre[genre.name] = [];
    });
    
    // Use aggregation to get movies for all genres in a single query
    const aggregationPipeline = [
      // Match movies that have a genreId that matches one of the requested genre IDs
      { 
        $match: { 
          genreId: { $in: genreIds } 
        } 
      },
      // Sort by sequentialId to maintain consistent ordering
      {
        $sort: { 
          sequentialId: 1  // 1 for ascending order
        }
      },
      // Group by genreId and collect movies
      {
        $group: {
          _id: "$genreId",
          movies: { 
            $push: {
              _id: "$_id",
              title: "$title",
              overview: "$overview",
              poster_path: "$poster_path",
              genreId: "$genreId"
            } 
          }
        }
      },
      // Limit the number of movies per genre
      {
        $project: {
          movies: { $slice: ["$movies", moviesPerGenre] }
        }
      }
    ] as any[];
    
    const results = await this.movieModel.aggregate(aggregationPipeline).exec();
    
    // Create a map of genre ID to movies for easy lookup
    const genreMoviesMap = new Map<number, any[]>();
    results.forEach(result => {
      genreMoviesMap.set(result._id, result.movies);
    });
    
    // Ensure all requested genres have entries in the result
    allGenres.forEach(genre => {
      moviesByGenre[genre.name] = genreMoviesMap.get(genre.id) || [];
    });
    
    return { moviesByGenre };
  }
}