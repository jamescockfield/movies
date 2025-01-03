import { MovieDb } from 'moviedb-promise';

// Initialize TMDb client
const tmdb = new MovieDb(process.env.TMDB_API_KEY!);

export { tmdb };