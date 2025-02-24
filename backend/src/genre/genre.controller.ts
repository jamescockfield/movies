import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async findAll() {
    return this.genreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const genre = await this.genreService.findById(Number(id));
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    return genre;
  }
}