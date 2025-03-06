import { Controller, Get, Param, Query, Inject, ParseIntPipe } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(@Inject(MovieService) private readonly movieService: MovieService) {}

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.movieService.search(query, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Get('genre/:genreId')
  async findByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.movieService.findByGenre(genreId, page, limit);
  }

  @Get()
  async findByGenreIds(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('genreIds') genreIdsString: string,
    @Query('moviesPerGenre', new ParseIntPipe({ optional: true })) moviesPerGenre: number,
  ) {
    const genreIds = genreIdsString.split(',').map(id => parseInt(id, 10));
    return this.movieService.findByGenres(genreIds, moviesPerGenre || 8);
  }
}