import { Module, OnModuleInit } from '@nestjs/common';
import { MovieRecommenderManager } from './MovieRecommenderManager';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MovieModule, UserModule],
  providers: [MovieRecommenderManager],
  exports: [MovieRecommenderManager],
})
export class RecommenderModule implements OnModuleInit {
  constructor(private recommenderManager: MovieRecommenderManager) {}

  async onModuleInit() {
    console.log('Loading recommender model...');
    await this.recommenderManager.init();
    await this.recommenderManager.loadModel();
    console.log('Recommender model loaded');
  }
}