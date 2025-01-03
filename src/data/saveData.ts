import { UserRatings } from '../types';
import { MongooseConnection } from '../database/MongooseConnection';
import { MovieRating } from '../database/MovieRating';
import { users, generateAllUserRatings } from './generate';


async function saveRatings(ratings: UserRatings) {
    const flattenedRatings = Object.values(ratings).flat();
    await MovieRating.insertMany(flattenedRatings);
}

// Main execution function
async function main() {
    const mongooseConnection = new MongooseConnection();
    await mongooseConnection.connectToMemoryDB();

    const ratings = await generateAllUserRatings(users);
    await saveRatings(ratings);
    
    // Example: Query the stored ratings
    const storedRatings = await MovieRating.find();
    console.log('Stored ratings:', storedRatings);
    
    await mongooseConnection.disconnect();
}

main().catch(console.error);
