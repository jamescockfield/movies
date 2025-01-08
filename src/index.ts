import dotenv from 'dotenv';
import { app } from './app/app';
import { recommender } from './app/utils';
import { MongooseConnection } from './database/MongooseConnection';
import { Genre } from './database/model/Genre';
import { Movie } from './database/model/Movie';
import { MovieRating } from './database/model/MovieRating';
import { User } from './database/model/User';

dotenv.config();

async function start() {
    if (!(await checkSeeded())) {
        console.log('Seeding was not completed. Please run `npm run seed` before starting the server');
        process.exit(1);
    }

    const mongooseConnection = new MongooseConnection(process.env.MONGODB_URI!);
    await mongooseConnection.connect();

    console.log('Loading recommender model...');
    await recommender.init();
    await recommender.loadModel();
    console.log('Recommender model recommender loaded');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

async function checkSeeded(): Promise<boolean> {
    return (
        !!(await Genre.exists({})) &&
        !!(await Movie.exists({})) &&
        !!(await User.exists({})) &&
        !!(await MovieRating.exists({})) &&
        recommender.modelExists()
    );
}

start();