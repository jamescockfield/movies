import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Genre extends Document {
  @Prop({ type: Number, required: true, unique: true })
  declare id: number;

  @Prop({ type: String, required: true })
  declare name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);