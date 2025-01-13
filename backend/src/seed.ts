import dotenv from 'dotenv';
import { downloadGenres } from './data/downloadGenres';
import { MovieDownloader } from './data/MovieDownloader';
import { generateUsers } from './data/generateUsers';
import { generateMovieRatings } from './data/generateMovieRatings';
import { MongooseConnection } from './database/MongooseConnection';
import { recommender } from './app/utils';

dotenv.config();

async function seed() {
    const mongooseConnection = new MongooseConnection(process.env.MONGODB_URI!);
    await mongooseConnection.connect();

    await downloadGenres();
    await new MovieDownloader().downloadMovies();
    await generateUsers();
    await generateMovieRatings();

    console.log('Seeding complete');

    if (recommender.modelExists()) {
        console.log('Model already exists, skipping training');
    } else {
        console.log('Training new model...');
        await recommender.init();
        await recommender.train();
        await recommender.saveModel();
        console.log('Model training complete');
    }

    process.exit(0);
}

seed();