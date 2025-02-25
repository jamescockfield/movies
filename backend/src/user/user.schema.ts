import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  declare username: string;

  @Prop({ type: String, required: true })
  declare password: string;

  @Prop({ type: Boolean, default: false })
  declare isAdmin: boolean;

  @Prop({ type: Date, default: Date.now })
  declare createdAt: Date;

  @Prop({ type: Number, required: true })
  declare genreId: number; // For now for simplicity, each user has a genre preference
}

export const UserSchema = SchemaFactory.createForClass(User);