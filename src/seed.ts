import dotenv from 'dotenv';
import { downloadGenres } from './data/downloadGenres';
import { downloadMovies } from './data/downloadMovies';
import { generateUsers } from './data/generateUsers';
import { generateMovieRatings } from './data/generateMovieRatings';

dotenv.config();

function seed() {
    downloadGenres();
    downloadMovies();
    generateUsers();
    generateMovieRatings();
}

seed();
