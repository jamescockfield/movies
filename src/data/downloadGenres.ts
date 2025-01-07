import { tmdb } from '../app/utils';
import { Genre } from '../database/model/Genre';
import { genres } from '../domain/genres';

async function downloadGenres() {
    const genreResponse = await tmdb.genreMovieList();

    const genreList = genreResponse.genres!.filter((genre) => genres.includes(genre.name!));

    await Genre.insertMany(genreList);
}

export { downloadGenres };
