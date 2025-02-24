// src/movie/schemas/movie.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop()
  declare adult: boolean;

  @Prop()
  declare backdrop_path: string;

  @Prop()
  declare id: number;

  @Prop()
  declare original_language: string;

  @Prop()
  declare original_title: string;

  @Prop()
  declare overview: string;

  @Prop()
  declare popularity: number;

  @Prop()
  declare poster_path: string;

  @Prop()
  declare release_date: string;

  @Prop()
  declare title: string;

  @Prop()
  declare video: boolean;

  @Prop()
  declare vote_average: number;

  @Prop()
  declare vote_count: number;

  @Prop([Number])
  declare genre_ids: number[];

  @Prop()
  declare genreId: number;

  @Prop()
  declare sequentialId: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);