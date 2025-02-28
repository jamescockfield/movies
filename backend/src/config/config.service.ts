import { Injectable } from '@nestjs/common';
import { configSchema, Config } from './config.schema';

@Injectable()
export class ConfigService {
  readonly config: Config;

  constructor() {
    this.config = configSchema.parse({
      database: {
        uri: process.env.MONGODB_URI,
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
      server: {
        port: Number(process.env.PORT) || 3000,
        host: process.env.HOST || '0.0.0.0',
      },
      tmdb: {
        apiKey: process.env.TMDB_API_KEY,
      },
    });
  }
} 