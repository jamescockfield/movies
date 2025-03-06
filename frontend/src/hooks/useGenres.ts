import { useFetch } from "./useFetch";
import { fetchGenres } from "@/services/api/genres";
import { Genre } from "@/types/types";

export const useGenres = () => {
  const { data, isLoading, error } = useFetch<Genre[]>(
    fetchGenres,
    undefined
  );

  return { genres: data || [], isLoading, error };
};

