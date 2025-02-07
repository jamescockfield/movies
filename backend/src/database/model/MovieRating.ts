import mongoose from 'mongoose';
import { MovieRatingType } from '../../types/types';

type MovieRatingDocument = MovieRatingType & mongoose.Document;

const MovieRatingSchema = new mongoose.Schema<MovieRatingDocument>({
    userId: Number,
    movieId: Number,
    rating: Number
});

const MovieRating = mongoose.model('MovieRating', MovieRatingSchema);

export { MovieRating };