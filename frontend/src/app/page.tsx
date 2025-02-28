'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MovieListContainer from '@/components/MovieList/MovieListContainer';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-8">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <MovieListContainer />
      </main>
    </div>
  );
}
