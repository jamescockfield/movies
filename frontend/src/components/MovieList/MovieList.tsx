'use client';

import { Movie } from '@/types/types';
import { Grid } from '@mui/material';
import { MovieListItem } from './MovieListItem';

interface MovieListProps {
  genreName: string;
  movies: Movie[];
}

export default function MovieList({ genreName, movies }: MovieListProps) {
  return (
    <Grid container spacing={2}>
      {movies.map((movie: Movie) => (
        <MovieListItem key={movie._id} genreName={genreName} movie={movie} />
      ))}
    </Grid>
  );
}