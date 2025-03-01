import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';
import { Genre } from '../../genre/genre.schema';
import { Movie } from '../../movie/movie.schema';
import { MovieRating } from '../../movie-rating/movie-rating.schema';
import ratingComments from './rating-comments.json';

interface MoviesByGenre {
  _id: number;
  movies: Movie[];
}

// Define the type for rating comments
interface RatingComments {
  [key: string]: string[];
}

@Injectable()
export class MovieRatingsSeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(MovieRating.name) private readonly movieRatingModel: Model<MovieRating>,
  ) {}

  async generate(): Promise<void> {
    if (await this.movieRatingModel.exists({})) {
      console.log('Movie ratings already exist in database, skipping');
      return;
    }

    const moviesByGenre: MoviesByGenre[] = await this.getMoviesAggregatedByGenre();
    const movieRatings: Partial<MovieRating>[] = [];

    const users = await this.userModel.find();

    for (const user of users) {
      console.log(`Generating ratings for user ${user.id}`);
      
      // Find movies matching this user's preferred genre
      const moviesMatchingUserGenre = moviesByGenre.find(group => group._id === user.genreId)?.movies || [];
      
      // If no movies found for this user's genre, log a warning
      if (moviesMatchingUserGenre.length === 0) {
        console.log(`Warning: No movies found for user ${user.id} with genre ${user.genreId}`);
        continue;
      }
      
      moviesMatchingUserGenre.forEach(movie => {
        const rating = Math.floor(Math.random() * 5) + 1;
        // Get comments for this rating and select a random one
        const comments = (ratingComments as RatingComments)[rating.toString()];
        const randomCommentIndex = Math.floor(Math.random() * comments.length);
        
        movieRatings.push({
          userId: user._id as User,
          movieId: movie._id as Movie,
          rating: rating,
          comment: comments[randomCommentIndex]
        });
      });
    }

    const result = await this.movieRatingModel.insertMany(movieRatings);

    console.log(`Inserted ${result.length} movie ratings into database`);
  }

  private async getMoviesAggregatedByGenre(): Promise<MoviesByGenre[]> {
    const genres = await this.genreModel.find();
    const genreIds = genres.map(genre => genre.id);

    return this.movieModel.aggregate([
      { $match: { genreId: { $in: genreIds } } },
      { $sort: { _id: -1 } },
      {
        $group: {
          _id: '$genreId',
          movies: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 1,
          movies: { $slice: ['$movies', 100] }  // Take only the first 100 movies per genre
        }
      }
    ]);
  }
}