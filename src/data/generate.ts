import dotenv from 'dotenv';
import { MovieResult } from 'moviedb-promise';
import { User, MovieRating, UserRatings } from '../types/types';
import { tmdb } from '../utils';

dotenv.config();

const genres: string[] = [
    'Science Fiction', 
    'Horror', 
    'Action', 
    'Comedy', 
    'Drama', 
    'Romance', 
    'Thriller', 
    'Animation', 
    'Fantasy', 
    'Documentary'
];

const users: User[] = [
    { id: 1, preference: 'Science Fiction', genreId: 878 },
    { id: 2, preference: 'Horror', genreId: 27 },
    { id: 3, preference: 'Action', genreId: 28 },
    { id: 4, preference: 'Comedy', genreId: 35 },
    { id: 5, preference: 'Drama', genreId: 18 },
    { id: 6, preference: 'Romance', genreId: 10749 },
    { id: 7, preference: 'Thriller', genreId: 53 },
    { id: 8, preference: 'Animation', genreId: 16 },
    { id: 9, preference: 'Fantasy', genreId: 14 },
    { id: 10, preference: 'Documentary', genreId: 99 }
];

async function generateUserRatings(user: User): Promise<MovieRating[]> {
    try {
        const movies = await tmdb.discoverMovie({
            with_genres: user.preference,
            sort_by: 'popularity.desc',
            page: Math.floor(Math.random() * 5) + 1
        });

        if (!movies.results) {
            throw new Error('No movies found');
        }

        const ratings: MovieRating[] = movies.results
            .slice(0, 20)
            .map((movie: MovieResult) => ({
                userId: user.id,
                movieId: movie.id!,
                movieTitle: movie.title!,
                rating: Math.floor(Math.random() * 5) + 6, // Generate rating between 6-10
                genre: user.preference
            }));

        return ratings;
    } catch (error) {
        console.error(`Error generating ratings for user ${user.id}:`, error);
        return [];
    }
}

async function generateAllUserRatings(users: User[]): Promise<UserRatings> {
    const allRatings: UserRatings = {};
    
    for (const user of users) {
        const ratings = await generateUserRatings(user);
        allRatings[user.id] = ratings;
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    return allRatings;
}

export { genres, users, generateUserRatings, generateAllUserRatings };