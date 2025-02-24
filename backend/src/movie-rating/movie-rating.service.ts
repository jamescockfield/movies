import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieRating } from './movie-rating.schema';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class MovieRatingService {
  constructor(
    @InjectModel(MovieRating.name) private readonly movieRatingModel: Model<MovieRating>,
    private readonly movieService: MovieService,
  ) {}

  async create(userId: string, movieId: number, rating: number): Promise<MovieRating> {
    // Verify movie exists
    await this.movieService.findById(movieId);

    // Update existing rating or create new one
    const existingRating = await this.movieRatingModel.findOne({ userId, movieId });
    if (existingRating) {
      existingRating.rating = rating;
      return existingRating.save();
    }

    const newRating = new this.movieRatingModel({ userId, movieId, rating });
    return newRating.save();
  }

  async findByUser(userId: string): Promise<MovieRating[]> {
    return this.movieRatingModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByMovie(movieId: number): Promise<MovieRating[]> {
    return this.movieRatingModel
      .find({ movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<MovieRating[]> {
    return this.movieRatingModel.find().exec();
  }

  async getAverageRating(movieId: number): Promise<number | null> {
    const result = await this.movieRatingModel.aggregate([
      { $match: { movieId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]).exec();

    return result.length > 0 ? result[0].averageRating : null;
  }

  async hasAnyRatings(): Promise<boolean> {
    return (await this.movieRatingModel.countDocuments().exec()) > 0;
  }
}