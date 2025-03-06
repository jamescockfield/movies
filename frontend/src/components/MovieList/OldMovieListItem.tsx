import { Card, CardContent, Chip, Typography, Box, CardActionArea } from "@mui/material";
import { Grid } from "@mui/material";
import MoviePoster from "../ui/MoviePoster";
import { Movie } from "@/types/types";
import { useRouter } from "next/navigation";

export const OldMovieListItem = ({ movie, genreName }: { movie: Movie, genreName: string }) => {

  const router = useRouter();

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <Grid item xs={12} sm={6} md={3} lg={2}>
      <Card
        className="h-full flex flex-col transition-transform duration-200 hover:translate-y-[-4px] hover:shadow-lg"
      >
        <CardActionArea
          onClick={() => handleMovieClick(movie._id)}
          className="h-full flex flex-col align-stretch"
        >
          <CardContent className="flex-grow flex flex-col">
            <Typography variant="h6" noWrap>{movie.title}</Typography>
            <Chip
              label={genreName}
              color="primary"
              size="small"
              className="mt-1 mb-1 self-start"
            />
            <Typography
              variant="body2"
              color="text.secondary"
              className="overflow-hidden text-ellipsis line-clamp-3 mb-1"
            >
              {movie.overview}
            </Typography>
            <Box className="mt-auto text-center">
              <MoviePoster movie={movie} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};
