import { MovieDb } from 'moviedb-promise';
import { MongooseConnection } from '../database/MongooseConnection';

// Initialize TMDb client
const tmdb = new MovieDb(process.env.TMDB_API_KEY!);

const mongooseConnection = new MongooseConnection(process.env.MONGODB_URI!);
mongooseConnection.connect();

export { tmdb };