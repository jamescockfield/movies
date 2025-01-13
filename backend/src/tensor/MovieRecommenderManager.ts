import fs from 'fs';
import path from 'path';
import { MovieRating } from '../database/model/MovieRating';
import { MovieRecommender } from './MovieRecommender';
import { Movie } from '../database/model/Movie';
import { MovieRatingType, MovieType } from '../types/types';
import { User } from '../database/model/User';

class MovieRecommenderManager {

    MODEL_PATH = path.join(process.cwd(), 'model');
    recommender?: MovieRecommender;

    async init() {
        const userIds = (await User.find()).map(user => user.id);
        const movieIds = (await Movie.find()).map(movie => movie.sequentialId);
        this.recommender = new MovieRecommender(userIds, movieIds);
    }

    async saveModel() {
        await this.recommender?.saveModel(this.MODEL_PATH);
    }

    async loadModel() {
        await this.recommender?.loadModel(this.MODEL_PATH);
    }

    modelExists(): boolean {
        return fs.existsSync(this.MODEL_PATH);
    }

    async train() {
        const ratings: MovieRatingType[] = await MovieRating.find();

        const userIds: number[] = [];
        const movieIds: number[] = [];
        const ratingValues: number[] = [];

        for (const rating of ratings) {
            userIds.push(rating.userId);
            movieIds.push(rating.movieId);
            ratingValues.push(rating.rating / 5.0); // Normalize ratings
        }

        await this.recommender!.train(userIds, movieIds, ratingValues);
    }

    async recommend(userId: number) {
        const movies: MovieType[] = await Movie.find();
        const recommendations = movies.map(movie => ({
            movie: movie.title,
            score: this.recommender!.predict(userId, movie.id!)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

        return recommendations;
    }
}

export { MovieRecommenderManager };