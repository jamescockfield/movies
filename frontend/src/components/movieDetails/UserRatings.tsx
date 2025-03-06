import { useMovieRatings } from "@/hooks/useMovieRatings";
import { MovieRating } from "@/types/types";
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, Rating, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import Link from "next/link";

export default function UserRatings({ movieId }: { movieId: string }) {
    const { ratings } = useMovieRatings(movieId);
    return (
        <Box>
            <Typography variant="h5" gutterBottom className="mt-6 mb-2">
                User Ratings
            </Typography>
            <Divider className="mb-3" />

            <Paper elevation={2} className="p-3">
                {ratings.length > 0 ? (
                    <List>
                        {ratings.map((rating: MovieRating) => (
                            <ListItem key={rating._id} alignItems="flex-start" divider>
                                <ListItemAvatar>
                                    <Avatar>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box className="flex items-center justify-between">
                                            <Box className="flex items-center">
                                                <Rating value={rating.rating} readOnly size="small" />
                                                <Typography variant="body2" className="ml-1">
                                                    {new Date(rating.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Link
                                                href={`/profile/${rating.userId._id}`}
                                                className="text-primary-main hover:underline"
                                            >
                                                {rating.userId.username || 'User'}
                                            </Link>
                                        </Box>
                                    }
                                    secondary={rating.comment || "No comment provided"}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body1" color="text.secondary" align="center">
                        No ratings yet. Be the first to rate this movie!
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}

