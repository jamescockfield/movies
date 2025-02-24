import { Injectable } from '@nestjs/common';
import { UsersSeederService } from './users.service';
import { GenresSeederService } from './genres.service';
import { MoviesSeederService } from './movies.service';
import { MovieRatingsSeederService } from './movie-ratings.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersSeeder: UsersSeederService,
    private readonly genresSeeder: GenresSeederService,
    private readonly moviesSeeder: MoviesSeederService,
    private readonly movieRatingsSeeder: MovieRatingsSeederService,
  ) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');
    
    await this.genresSeeder.generate();
    await this.usersSeeder.generate();
    await this.moviesSeeder.generate();
    await this.movieRatingsSeeder.generate();
    
    console.log('Database seeding completed');
  }
} 