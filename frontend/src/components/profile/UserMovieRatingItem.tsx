import MoviePoster from "../ui/MoviePoster";
import { MovieRating } from "@/types/types";

export const UserMovieRatingItem = ({ rating }: { rating: MovieRating }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
    {/* Movie Thumbnail */}
    <div className="h-48 bg-gray-200 relative">
      <MoviePoster movie={rating.movieId!} />
      <div className="absolute top-2 right-2 flex items-center bg-yellow-100 px-2 py-1 rounded shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-bold text-outline">{rating.rating}/5</span>
      </div>
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <div>
        <h3 className="text-xl font-semibold mb-2">
          <a
            href={`/movies/${rating.movieId._id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {rating.movieId.title}
          </a>
        </h3>

        {rating.comment && (
          <p className="text-gray-700 mb-2">{rating.comment}</p>
        )}
      </div>

      <div className="text-sm text-gray-500 mt-auto">
        {new Date(rating.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);