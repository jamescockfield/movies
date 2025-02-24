import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './genre.schema';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  providers: [GenreService],
  controllers: [GenreController],
  exports: [GenreService],
})
export class GenreModule {}