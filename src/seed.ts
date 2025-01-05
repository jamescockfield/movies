import { tmdb } from './utils';
import { genres } from './data/generate';
import { Genre, MovieResult } from 'moviedb-promise';
import { Movie } from './database/model/Movie';

async function persistMoviesForGenres() {
    // First, get the genre mappings from TMDB
    const genreMap = await getGenreMap();
    
    const movies: MovieResult[] = [];

    // Get 100 movies for each genre
    for (const genreName of genres) {
        const genreId = genreMap.get(genreName);
        if (!genreId) continue;
        
        try {
            const newMovies = await getMoviesForGenre(genreId);

            console.log(`Found ${movies.length} movies for ${genreName}`);

            movies.push(...newMovies);

            // Add delay to respect rate limiting
            await new Promise(resolve => setTimeout(resolve, 250));
        } catch (error) {
            console.error(`Error fetching movies for ${genreName}:`, error);
        }
    }

    // Persist movies to database
    await Movie.insertMany(movies);
}

async function getGenreMap(): Promise<Map<string, number>> {
    const genreList = await tmdb.genreMovieList();
    const genreMap = new Map<string, number>();
    
    genreList.genres?.forEach((genre: Genre) => {
        genreMap.set(genre.name!, genre.id!);
    });

    return genreMap;
}

async function getMoviesForGenre(genreId: number): Promise<MovieResult[]> {
    const movies: MovieResult[] = [];

    // Fetch 5 pages to get 100 movies
    for (let page = 1; page <= 5; page++) {
        const response = await tmdb.discoverMovie({
            with_genres: genreId.toString(),
            sort_by: 'popularity.desc',
            page: page,
            include_adult: false
        });
        
        if (response.results) {
            movies.push(...response.results);
        }
    }
    
    return movies;
}

persistMoviesForGenres().catch(console.error);
