import fs from 'fs';
import path from 'path';
import { MovieRating } from '../movie-rating/movie-rating.schema';
import { MovieRecommender } from './MovieRecommender';
import { Movie } from '../movie/movie.schema';
import { MovieRatingType, MovieType } from '../types/types';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { MovieRatingService } from '../movie-rating/movie-rating.service';

class MovieRecommenderManager {

    MODEL_PATH = path.join(process.cwd(), 'model/model.json');
    recommender?: MovieRecommender;

    constructor(
      private readonly userService: UserService,
      private readonly movieService: MovieService,
      private readonly movieRatingService: MovieRatingService,
    ) {}

    async init() {
        const userIds = (await this.userService.findAll()).map(user => user.id);
        const movieIds = (await this.movieService.findAll()).movies.map(movie => movie.id);
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
        const ratings: MovieRating[] = await this.movieRatingService.findAll();

        const userIds: number[] = [];
        const movieIds: number[] = [];
        const ratingValues: number[] = [];

        for (const rating of ratings) {
            userIds.push(rating.userId.id);
            movieIds.push(rating.movieId);
            ratingValues.push(rating.rating / 5.0); // Normalize ratings
        }

        await this.recommender!.train(userIds, movieIds, ratingValues);
    }

    async recommend(userId: number) {
        // TODO: review whether to store all movies in memory to save query all for each rec
        const movies: Movie[] = (await this.movieService.findAll()).movies;
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