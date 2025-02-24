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
    const users = await this.userModel.find().lean().exec();

    for (const user of users) {
      console.log(`Generating ratings for user ${user.id}`);
      
      moviesByGenre.find(movies => movies._id === user.genreId)?.movies.forEach(movie => {
        movieRatings.push({
          userId: user.id,
          movieId: movie.sequentialId,
          rating: Math.floor(Math.random() * 5) + 6,
        });
      });
    }

    console.log(`Inserting ${movieRatings.length} movie ratings into database`);
    await this.movieRatingModel.insertMany(movieRatings, { ordered: false });
    console.log('Movie ratings inserted');
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