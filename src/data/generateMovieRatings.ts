import { User } from '../database/model/User';
import { Genre } from '../database/model/Genre';
import { Movie } from '../database/model/Movie';
import { MovieRating } from '../database/model/MovieRating';
import { UserType } from '../types/types';
import { MovieType } from '../types/types';
import { MovieRatingType } from '../types/types';
import { GenreType } from '../types/types';

// Helper type for retrieving movies from DB by genre
interface MoviesByGenre {
  _id: number;  // genreId
  movies: MovieType[];
}

/**
 * For each user, generate 20 random ratings for movies in their preferred genre
 */
async function generateMovieRatings() {
    const moviesByGenre: MoviesByGenre[] = await getMoviesAggregatedByGenre();

    const movieRatings: MovieRatingType[] = [];

    const users: UserType[] = await User.find().lean().exec();

    // Generate ratings for each user
    for (const user of users) {
        moviesByGenre.find(movies => movies._id === user.genreId)!.movies.forEach(movie => {
            movieRatings.push({
                userId: user.id,
                movieId: movie.id!,
                rating: Math.floor(Math.random() * 5) + 6,
            });
        });
    }

    await MovieRating.insertMany(movieRatings, { ordered: false });
}

async function getMoviesAggregatedByGenre(): Promise<MoviesByGenre[]> {
    const genres: GenreType[] = await Genre.find();
    const genreIds: number[] = genres.map(genre => genre.id);

    // Get 20 movies for each genre grouped by genreId
    const moviesByGenre: MoviesByGenre[] = await Movie.aggregate([
        { $match: { genreId: { $in: genreIds } } },
        { $group: {
            _id: "$genreId",
            movies: { 
                $push: {
                    $cond: {
                        if: { $lt: [{ $size: "$movies" }, 20] },
                        then: "$$ROOT",
                        else: "$$PRUNE"
                    }
                }
            }
        }}
    ]);

    return moviesByGenre;
}

export { generateMovieRatings };
