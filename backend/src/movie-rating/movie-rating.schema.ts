import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Movie } from '../movie/movie.schema';

@Schema()
export class MovieRating extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  declare userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
  declare movieId: Movie;

  @Prop({ type: Number, required: true, min: 0.5, max: 5 })
  declare rating: number;

  @Prop({ type: Date, default: Date.now })
  declare createdAt: Date;
}

export const MovieRatingSchema = SchemaFactory.createForClass(MovieRating);