import { tmdb } from '../app/utils';
import { Genre } from '../database/model/Genre';
import { genres } from '../domain/genres';

async function downloadGenres() {
    if (await Genre.exists({})) {
        console.log('Genres already exist in database, skipping');

        return;
    }

    const genreResponse = await tmdb.genreMovieList();

    const genreList = genreResponse.genres!.filter((genre) => genres.includes(genre.name!));

    console.log('found genres:', genreList.map((genre) => genre.name));

    await Genre.insertMany(genreList);

    console.log('genres inserted');
}

export { downloadGenres };
