import { Movie } from "@/types/types";
import { useRouter } from "next/navigation";
import MoviePoster from "../ui/MoviePoster";

export const SearchResults = ({ movies }: { movies: Movie[] }) => {
    const router = useRouter();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map(movie => (
          <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <MoviePoster movie={movie} />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-blue-600 mb-2 font">{movie.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Released: {new Date(movie.release_date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3">{movie.overview}</p>
              <button 
                onClick={() => router.push(`/movies/${movie._id}`)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
};
