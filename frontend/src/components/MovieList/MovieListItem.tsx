import { Card, CardContent, Chip, Typography, Box, CardActionArea } from "@mui/material";
import MoviePoster from "../ui/MoviePoster";
import { Movie } from "@/types/types";
import { useRouter } from "next/navigation";

export const MovieListItem = ({ movie, genreName }: { movie: Movie, genreName: string }) => {
  const router = useRouter();

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <Box sx={{ padding: '4px' }}>
      <Card
        className="h-full flex flex-col transition-transform duration-200 hover:translate-y-[-4px] hover:shadow-lg"
        sx={{ borderRadius: '10px' }}
      >
        <CardActionArea
          onClick={() => handleMovieClick(movie._id)}
          className="h-full flex flex-col align-stretch"
        >
          <Box className="h-48 mt-auto text-center">
            <MoviePoster movie={movie} />
          </Box>
          <CardContent className="flex-grow flex flex-col" sx={{ padding: '10px', paddingBottom: '20px' }}>
            <Typography variant="h6" noWrap>{movie.title}</Typography>
            <Box className="flex items-center justify-between pr-3">
              <Chip
                label={genreName}
                color="primary"
                size="small"
                className="my-1"
              />
              <Typography
                variant="body1"
                fontWeight="bold"
                className="text-gray-700"
              >
                {movie.release_date || 2017}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              className="overflow-hidden text-ellipsis line-clamp-3 mb-1"
            >
              {movie.overview}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};
