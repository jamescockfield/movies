import { MovieResult } from 'moviedb-promise';

type MovieType = MovieResult & { genreId: number };

// TODO: consider inferring these types from mongoose schemas

interface UserType {
    id: number;
    genreId: number;
}

interface GenreType {
    id: number;
    name: string;
}

interface MovieRatingType {
    userId: number;
    movieId: number;
    rating: number;
}

export { UserType, MovieType, MovieRatingType, GenreType };