import { downloadGenres } from './data/downloadGenres';
import { downloadMovies } from './data/downloadMovies';
import { generateUsers } from './data/generateUsers';
import { generateMovieRatings } from './data/generateMovieRatings';
import { MongooseConnection } from './database/MongooseConnection';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
    const mongooseConnection = new MongooseConnection(process.env.MONGODB_URI!);
    mongooseConnection.connect();

    await downloadGenres();
    await downloadMovies();
    await generateUsers();
    await generateMovieRatings();

    console.log('Seeding complete');
    process.exit(0);
}

seed();