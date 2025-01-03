import { MovieRecommender } from './MovieRecommender';
import { movies, ratings } from './data';

class MovieRecommenderManager {

    recommender = new MovieRecommender(100, 1000); // Adjust dimensions based on your data

    async train() {
        const userIds = ratings.map(r => r.userId);
        const movieIds = ratings.map(r => r.movieId);
        const ratingValues = ratings.map(r => r.rating / 5.0); // Normalize ratings

        await this.recommender.train(userIds, movieIds, ratingValues);
    }

    recommend(userId: number) {
        const recommendations = movies.map(movie => ({
            movie: movie.title,
            score: this.recommender.predict(userId, movie.id)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

        return recommendations;
    }
}

export { MovieRecommenderManager };