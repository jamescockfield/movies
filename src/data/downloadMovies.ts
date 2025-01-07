import { tmdb } from '../app/utils';
import { genres } from '../domain/genres';
import { MovieResult } from 'moviedb-promise';
import { Movie } from '../database/model/Movie';
import { MovieType } from '../types/types';
import { Genre } from '../database/model/Genre';

async function downloadMovies() {
    if (await Movie.exists({})) {
        console.log('Movies already exist in database, skipping');

        return;
    }

    const genres = await Genre.find();
    
    const movies: MovieType[] = [];

    // Get 100 movies for each genre
    for (const genre of genres) {
        
        try {
            const newMovies = await getMoviesForGenre(genre.id);

            console.log(`Found ${newMovies.length} movies for ${genre.name}`);

            movies.push(...newMovies);

            // Add delay to respect rate limiting
            await new Promise(resolve => setTimeout(resolve, 250));
        } catch (error) {
            console.error(`Error fetching movies for ${genre.name}:`, error);
        }
    }

    console.log(`Inserting ${movies.length} movies into database`);

    await Movie.insertMany(movies);

    console.log('Movies inserted');
}

async function getMoviesForGenre(genreId: number): Promise<MovieType[]> {
    const movieResults: MovieResult[] = [];

    // Fetch 5 pages to get 100 movies
    for (let page = 1; page <= 5; page++) {
        const response = await tmdb.discoverMovie({
            with_genres: genreId.toString(),
            sort_by: 'popularity.desc',
            page: page,
            include_adult: false
        });
        
        if (response.results) {
            movieResults.push(...response.results);
        } else {
            console.error(`No results found for genre ${genreId} on page ${page}`);
        }
    }

    // Assign a primary genre to each movie for ease
    const movies: MovieType[] = movieResults.map(movieResult => 
        ({ ...movieResult, genreId })
    );

    
    return movies;
}

export { downloadMovies };