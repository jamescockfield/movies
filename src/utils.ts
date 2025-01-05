import dotenv from 'dotenv';
import { MovieDb } from 'moviedb-promise';
import { MongooseConnection } from './database/MongooseConnection';

dotenv.config();

// Initialize TMDb client
const tmdb = new MovieDb(process.env.TMDB_API_KEY!);

const mongooseConnection = new MongooseConnection();
mongooseConnection.connectToMemoryDB();
const mongod = mongooseConnection.mongod;

export { tmdb, mongod };