import { User } from '../database/model/User';
import { UserType, GenreType } from '../types/types';
import { Genre } from '../database/model/Genre';

/**
 * Generate a user for each of our genres
 */
async function generateUsers() {
    const genres: GenreType[] = await Genre.find();

    const users: UserType[] = genres.map((genre: GenreType, index) => ({
        id: index + 1,
        genreId: genre.id
    }));
    
    await User.insertMany(users);
}

export { generateUsers };