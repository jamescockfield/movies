import mongoose from 'mongoose';

const MovieRatingSchema = new mongoose.Schema({
    userId: Number,
    movieId: Number,
    movieTitle: String,
    rating: Number,
    genre: String
});

const MovieRating = mongoose.model('MovieRating', MovieRatingSchema);

export { MovieRating };