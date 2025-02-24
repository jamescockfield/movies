import { Controller, Get, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MovieService } from './movie.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.movieService.findAll(page, limit);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.movieService.search(query, page, limit);
  }

  @Get('genre/:genreId')
  async findByGenre(
    @Param('genreId', ParseIntPipe) genreId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.movieService.findByGenre(genreId, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.findById(id);
  }
}