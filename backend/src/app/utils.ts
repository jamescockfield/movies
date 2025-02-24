import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import { MovieRecommenderManager } from '../recommender/MovieRecommenderManager';

dotenv.config();

const tmdb = new MovieDb(process.env.TMDB_API_KEY!);

const recommender = new MovieRecommenderManager();

export { tmdb, recommender };