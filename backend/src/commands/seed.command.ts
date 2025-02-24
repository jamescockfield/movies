import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SeedService } from '../data/seed/seed.service';

@Injectable()
export class SeedCommand {
  constructor(private readonly seedService: SeedService) {}

  @Command({
    command: 'seed',
    describe: 'Seed the database with initial data',
  })
  async run(): Promise<void> {
    await this.seedService.seed();
  }
} 