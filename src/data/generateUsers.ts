import { User } from '../database/model/User';
import { UserType, GenreType } from '../types/types';
import { Genre } from '../database/model/Genre';

/**
 * Generate a user for each of our genres
 */
async function generateUsers() {
    if (await User.exists({})) {
        console.log('Users already exist in database, skipping');

        return;
    }

    const genres: GenreType[] = await Genre.find();

    const users: UserType[] = genres.map((genre: GenreType, index) => ({
        id: index + 1,
        genreId: genre.id
    }));

    console.log('Inserting users:', users);
    
    await User.insertMany(users);

    console.log('Users inserted');
}

export { generateUsers };