import mongoose from 'mongoose';
import { MovieRating } from '../../types/types';

type MovieRatingDocument = MovieRating & mongoose.Document;

const MovieRatingSchema = new mongoose.Schema<MovieRatingDocument>({
    userId: Number,
    movieId: Number,
    movieTitle: String,
    rating: Number,
    genre: String
});

const MovieRating = mongoose.model('MovieRating', MovieRatingSchema);

export { MovieRating };