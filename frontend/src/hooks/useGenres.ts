import { useEffect, useState } from "react";
import { fetchGenres } from "@/services/api/genres";
import { Genre } from "@/types/types";

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    getGenres();
  }, []);

  return { genres, isLoading, error };
};

