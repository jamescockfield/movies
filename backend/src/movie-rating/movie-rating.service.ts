import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MovieRating } from './movie-rating.schema';
import { MovieService } from '@/movie/movie.service';

@Injectable()
export class MovieRatingService {
  constructor(
    @InjectModel(MovieRating.name) private readonly movieRatingModel: Model<MovieRating>,
    private readonly movieService: MovieService,
  ) {}

  async create(userId: string, movieId: string, rating: number): Promise<MovieRating> {
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
      .find({ userId: new Types.ObjectId(userId) })
      .populate('movieId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByMovie(movieId: string): Promise<MovieRating[]> {
    return this.movieRatingModel
      .find({ movieId: new Types.ObjectId(movieId) })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(): Promise<MovieRating[]> {
    return this.movieRatingModel.find().exec();
  }

  async getAverageRating(movieId: string): Promise<number | null> {
    const result = await this.movieRatingModel.aggregate([
      { $match: { movieId: new Types.ObjectId(movieId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]).exec();

    return result.length > 0 ? result[0].averageRating : null;
  }

  async hasAnyRatings(): Promise<boolean> {
    return (await this.movieRatingModel.countDocuments().exec()) > 0;
  }

  async getRecentRatings() {
    // Get ratings from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.movieRatingModel.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).exec();
  }
}