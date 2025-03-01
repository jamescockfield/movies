import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';
import { Genre } from '../../genre/genre.schema';
import { Movie } from '../../movie/movie.schema';
import { MovieRating } from '../../movie-rating/movie-rating.schema';

interface MoviesByGenre {
  _id: number;
  movies: Movie[];
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

    // const users = await this.userModel.find().lean().exec();
    const users = await this.userModel.find();

    for (const user of users) {
      console.log(`Generating ratings for user ${user.id}`);
      
      // const moviesMatchingUserGenre = moviesByGenre.find(movies => movies._id === user.genreId)?.movies;

      // TODO: debug aggregation so we actually have ratings for all genres
      const moviesMatchingUserGenre = moviesByGenre[0].movies;
      
      moviesMatchingUserGenre.forEach(movie => {
        movieRatings.push({
          userId: user.id,
          movieId: movie.id,
          rating: Math.floor(Math.random() * 5) + 1,
        });
      });
    }

    const result = await this.movieRatingModel.insertMany(movieRatings, { ordered: false });

    console.log(`Inserted ${result.length} movie ratings into database`);
  }

  private async getMoviesAggregatedByGenre(): Promise<MoviesByGenre[]> {
    const genres = await this.genreModel.find();
    const genreIds = genres.map(genre => genre.id);

    // TODO: test aggregation to ensure it still works
    
    return this.movieModel.aggregate([
      { $match: { genreId: { $in: genreIds } } },
      { $sort: { _id: -1 } },
      { $limit: 100 },
      {
        $group: {
          _id: '$genreId',
          movies: { $push: '$$ROOT' }
        }
      }
    ]);
  }
}