import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  declare username: string;

  @Prop({ required: true })
  declare password: string;

  @Prop({ default: false })
  declare isAdmin: boolean;

  @Prop({ default: Date.now })
  declare createdAt: Date;

  @Prop({ required: true })
  declare genreId: number; // For now for simplicity, each user has a genre preference
}

export const UserSchema = SchemaFactory.createForClass(User);