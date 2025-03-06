import { MovieRating } from "@/types/types";
import { UserMovieRatingItem } from "./UserMovieRatingItem";

export default function UserMovieRatingList({ userId, ratings }: { userId: string, ratings: MovieRating[] }) {
  return (
    <div className="w-full max-w-6xl">
      <h2 className="text-2xl font-bold mb-4">Movie Ratings</h2>
      
      <div className="mb-8">
        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ratings.map((rating) => (
              <UserMovieRatingItem key={rating._id} rating={rating} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}