import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MovieDb } from 'moviedb-promise';

@Injectable()
export class TmdbService {
  private movieDb!: MovieDb;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    console.log('TmdbService constructor - configService:', configService);
  }

  initClient(): void {
    console.log('TmdbService initClient - configService:', this.configService);
    const apiKey = this.configService.get('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB API Key not found in configuration');
    }
    this.movieDb = new MovieDb(apiKey);
  }

  get client(): MovieDb {
    console.log('TmdbService get client - movieDb:', this.movieDb);
    if (!this.movieDb) {
      this.initClient();
    }
    return this.movieDb;
  }
} 