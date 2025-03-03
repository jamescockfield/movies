import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, Typography, Box } from "@mui/material";
import { Movie } from "@/types/types";
import { submitRating } from "@/hooks/useMovieRatings";
import { useRouter } from "next/navigation";

export default function RatingDialog({ movie, openRatingDialog, setOpenRatingDialog }: { movie: Movie, openRatingDialog: boolean, setOpenRatingDialog: (open: boolean) => void }) {
    const [userRating, setUserRating] = useState<number | null>(null);
    const router = useRouter();

    const handleRatingSubmit = async () => {
      if (userRating) {
        try {
          await submitRating(movie._id, userRating);
          router.refresh(); // TODO: implement a more elegant way to refetch
          setOpenRatingDialog(false);
        } catch (error) {
          console.error('Error submitting rating:', error);
        }
      }
    };

    return (
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle>Rate this movie</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Typography variant="body1" gutterBottom>
              How would you rate "{movie.title}"?
            </Typography>
            <Rating
              name="movie-rating"
              value={userRating}
              onChange={(_, newValue) => setUserRating(newValue || 0)}
              precision={0.5}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRatingSubmit} 
            color="primary" 
            disabled={!userRating}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
}
