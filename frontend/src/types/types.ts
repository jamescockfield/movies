// TODO: consider using swagger on the backend to generate the types and a client library

export interface UserProfile {
  _id: string;
  username: string;
  isAdmin: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesByGenre {
  genres: Genre[];
  moviesByGenre: Record<string, Movie[]>;
  isLoading: boolean;
  error: Error | null;
}

export interface MovieRating {
  _id: string;
  movieId: Partial<Movie>;
  movieTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
  userId: Partial<UserProfile>;
}

export interface Movie {
  _id: string;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genreId: number;
}
