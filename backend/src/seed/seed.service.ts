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
  private readonly usersSeeder: UsersSeederService;
  private readonly genresSeeder: GenresSeederService;
  private readonly moviesSeeder: MoviesSeederService;
  private readonly movieRatingsSeeder: MovieRatingsSeederService;
  private readonly recommender: RecommenderService;
  private readonly genreModel: Model<any>;
  private readonly movieModel: Model<any>;
  private readonly userModel: Model<any>;
  private readonly movieRatingModel: Model<any>;

  constructor(
    @Inject(UsersSeederService) usersSeeder: UsersSeederService,
    @Inject(GenresSeederService) genresSeeder: GenresSeederService,
    @Inject(MoviesSeederService) moviesSeeder: MoviesSeederService,
    @Inject(MovieRatingsSeederService) movieRatingsSeeder: MovieRatingsSeederService,
    @Inject(RecommenderService) recommender: RecommenderService,
    @InjectModel('Genre') genreModel: Model<any>,
    @InjectModel('Movie') movieModel: Model<any>,
    @InjectModel('User') userModel: Model<any>,
    @InjectModel('MovieRating') movieRatingModel: Model<any>,
  ) {
    console.log('SeedService constructor - genresSeeder:', genresSeeder);
    this.usersSeeder = usersSeeder;
    this.genresSeeder = genresSeeder;
    this.moviesSeeder = moviesSeeder;
    this.movieRatingsSeeder = movieRatingsSeeder;
    this.recommender = recommender;
    this.genreModel = genreModel;
    this.movieModel = movieModel;
    this.userModel = userModel;
    this.movieRatingModel = movieRatingModel;
  }

  async seed(): Promise<void> {
    console.log('Starting database seeding...');
    console.log('GenresSeederService: ', this.genresSeeder);
    
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