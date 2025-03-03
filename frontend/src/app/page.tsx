'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MovieListContainer from '@/components/MovieList/MovieListContainer';

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <MovieListContainer />
      </main>
    </div>
  );
}
