import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieDb } from 'moviedb-promise';

@Injectable()
export class TmdbService {
  private movieDb!: MovieDb;

  constructor(private configService: ConfigService) {}

  initClient(): void {
    this.movieDb = new MovieDb(this.configService.get('TMDB_API_KEY')!);
  }

  get client(): MovieDb {
    if (!this.movieDb) {
      this.initClient();
    }
    return this.movieDb;
  }
} 