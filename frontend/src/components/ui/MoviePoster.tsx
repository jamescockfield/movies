import { Movie } from "@/types/types";

export default function MoviePoster({ movie }: { movie: Partial<Movie> }) {
  return (
    <img 
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
      alt={movie.title}
      className="w-full h-full object-cover"
    />
  );
}