// src/movie/schemas/movie.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ type: Boolean })
  declare adult: boolean;

  @Prop({ type: String })
  declare backdrop_path: string;

  @Prop({ type: Number })
  declare id: number;

  @Prop({ type: String })
  declare original_language: string;

  @Prop({ type: String })
  declare original_title: string;

  @Prop({ type: String })
  declare overview: string;

  @Prop({ type: Number })
  declare popularity: number;

  @Prop({ type: String })
  declare poster_path: string;

  @Prop({ type: String })
  declare release_date: string;

  @Prop({ type: String })
  declare title: string;

  @Prop({ type: Boolean })
  declare video: boolean;

  @Prop({ type: Number })
  declare vote_average: number;

  @Prop({ type: Number })
  declare vote_count: number;

  @Prop({ type: [Number] })
  declare genre_ids: number[];

  @Prop({ type: Number })
  declare genreId: number;

  @Prop({ type: Number })
  declare sequentialId: number;

  @Prop({ type: Number })
  declare tmdb_id: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);