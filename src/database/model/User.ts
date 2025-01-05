import mongoose from 'mongoose';
import { User } from '../../types/types';

type UserDocument = User & mongoose.Document;

const UserSchema = new mongoose.Schema<UserDocument>({
    id: Number,
    preference: String
});

const User = mongoose.model('User', UserSchema);

export { User };