import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';

dotenv.config();

// Initialize TMDb client
const tmdb = new MovieDb(process.env.TMDB_API_KEY!);

export { tmdb };