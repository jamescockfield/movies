'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MovieListContainer from '@/components/MovieList/MovieListContainer';
import ProfileDropdown from '@/components/ProfileDropdown';

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
    <div className="grid grid-rows-[auto_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-end w-full py-4">
        <ProfileDropdown />
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <MovieListContainer />
      </main>
    </div>
  );
}
