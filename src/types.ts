interface User {
    id: number;
    preference: string;
    genreId: number;
}

interface MovieRating {
    userId: number;
    movieId: number;
    movieTitle: string;
    rating: number;
    genre: string;
}

interface UserRatings {
    [key: number]: MovieRating[];
}

export { User, MovieRating, UserRatings };