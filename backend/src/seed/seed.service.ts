import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersSeederService } from './users.service';
import { GenresSeederService } from './genres.service';
import { MoviesSeederService } from './movies.service';
import { MovieRatingsSeederService } from './movie-ratings.service';
import { RecommenderService } from '../recommender/recommender.service';

@Injectable()
export class SeedService {
  constructor(
    @Inject(UsersSeederService) private readonly usersSeeder: UsersSeederService,
    @Inject(GenresSeederService) private readonly genresSeeder: GenresSeederService,
    @Inject(MoviesSeederService) private readonly moviesSeeder: MoviesSeederService,
    @Inject(MovieRatingsSeederService) private readonly movieRatingsSeeder: MovieRatingsSeederService,
    @Inject(RecommenderService) private readonly recommender: RecommenderService,
    @InjectModel('Genre') private readonly genreModel: Model<any>,
    @InjectModel('Movie') private readonly movieModel: Model<any>,
    @InjectModel('User') private readonly userModel: Model<any>,
    @InjectModel('MovieRating') private readonly movieRatingModel: Model<any>,
  ) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');
    
    await this.genresSeeder.generate();
    await this.usersSeeder.generate();
    await this.moviesSeeder.generate();
    await this.movieRatingsSeeder.generate();
    
    console.log('Database seeding completed');
  }

  async checkSeeded(): Promise<boolean> {
    console.log('Checking if seeded...');

    return (
      !!(await this.genreModel.exists({})) &&
      !!(await this.movieModel.exists({})) &&
      !!(await this.userModel.exists({})) &&
      !!(await this.movieRatingModel.exists({})) &&
      this.recommender.modelExists()
    );
  }
} 