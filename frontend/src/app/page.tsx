'use client';

import GenreMovieListContainer from '@/components/MovieList/GenreMovieListContainer';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <GenreMovieListContainer />
      </main>
    </div>
  );
}
