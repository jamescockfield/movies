import { tmdb } from '../app/utils';
import { MovieResult } from 'moviedb-promise';
import { Movie } from '../database/model/Movie';
import { MovieType } from '../types/types';
import { Genre } from '../database/model/Genre';

class MovieDownloader {

    private movies = new Set<MovieType>();
    private currentSequentialId = 1;

    async downloadMovies(): Promise<void> {
        if (await Movie.exists({})) {
            console.log('Movies already exist in database, skipping');
            return;
        }

        const genres = await Genre.find();

        for (const genre of genres) {
            try {
                await this.getMoviesForGenre(genre.id, genre.name);

                // Wait 250ms between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 250));
            } catch (error) {
                console.error(`Error fetching movies for ${genre.name}:`, error);
            }
        }

        console.log(`Inserting ${this.movies.size} unique movies into database`);

        await Movie.insertMany([...this.movies]);

        console.log('Movies inserted');
    }

    private async getMoviesForGenre(genreId: number, genreName: string): Promise<void> {
        let page = 1;
        let moviesForGenre = 0;

        while (moviesForGenre < 100 && page <= 20) {
            const response = await tmdb.discoverMovie({
                with_genres: genreId.toString(),
                sort_by: 'popularity.desc',
                page: page,
                include_adult: false
            });

            if (!response.results) {
                console.error(`No results found for genre ${genreId} on page ${page}`);
                break;
            }

            for (const movieResult of response.results) {
                const movieType = this.mapToMovieType(movieResult, genreId);
                const initialSize = this.movies.size;
                
                this.movies.add(movieType);
                
                // Ensure we only add unique movies
                if (this.movies.size > initialSize) {
                    moviesForGenre++;
                }

                if (moviesForGenre >= 100) {
                    break;
                }
            }

            page++;
        }

        console.log(`Found ${moviesForGenre} unique movies for ${genreName}`);
    }

    private mapToMovieType(movieResult: MovieResult, genreId: number): MovieType {
        return {
            ...movieResult,
            genreId,
            sequentialId: this.currentSequentialId++
        };
    }
}

export { MovieDownloader };