import mongoose from 'mongoose';
import { MovieType } from '../../types/types';

type MovieDocument = MovieType & mongoose.Document;

const MovieSchema = new mongoose.Schema<MovieDocument>({
    adult: Boolean,
    backdrop_path: String,
    id: Number,
    original_language: String, 
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    genre_ids: [Number],
    genreId: Number // Primary genre of the movie for simplicity
});

const Movie = mongoose.model('Movie', MovieSchema);

export { Movie, MovieDocument };
