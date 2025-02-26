import { Inject } from '@nestjs/common';
import { Module, OnModuleInit } from '@nestjs/common';
import { MovieRecommenderManager } from './MovieRecommenderManager';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';
import { MovieRatingModule } from '../movie-rating/movie-rating.module';

@Module({
  imports: [MovieModule, UserModule, MovieRatingModule],
  providers: [MovieRecommenderManager, RecommenderService],
  controllers: [RecommenderController],
  exports: [MovieRecommenderManager, RecommenderService],
})
export class RecommenderModule implements OnModuleInit {
  constructor(@Inject(MovieRecommenderManager) private recommenderManager: MovieRecommenderManager) {}

  async onModuleInit() {
    console.log('Loading recommender model...');
    await this.recommenderManager.init();
    if (this.recommenderManager.modelExists()) {
      await this.recommenderManager.loadModel();
    }
    console.log('Recommender model loaded');
  }
}