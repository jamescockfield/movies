import { Injectable } from '@nestjs/common';
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
    private readonly usersSeeder: UsersSeederService,
    private readonly genresSeeder: GenresSeederService,
    private readonly moviesSeeder: MoviesSeederService,
    private readonly movieRatingsSeeder: MovieRatingsSeederService,
    private readonly recommender: RecommenderService,
    @InjectModel('Genre') private genreModel: Model<any>,
    @InjectModel('Movie') private movieModel: Model<any>,
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('MovieRating') private movieRatingModel: Model<any>,
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
    return (
      !!(await this.genreModel.exists({})) &&
      !!(await this.movieModel.exists({})) &&
      !!(await this.userModel.exists({})) &&
      !!(await this.movieRatingModel.exists({})) &&
      this.recommender.modelExists()
    );
  }
} 