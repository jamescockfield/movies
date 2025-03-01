// TODO: consider using swagger on the backend to generate the types and a client library

export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  poster_path: string;
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
  id: string;
  movieId: number;
  movieTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Movie {
  _id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genreId: number;
}
