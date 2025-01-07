import mongoose from 'mongoose';
import { UserType } from '../../types/types';

type UserDocument = UserType & mongoose.Document;

const UserSchema = new mongoose.Schema<UserDocument>({
    id: Number,
    genreId: Number
});

const User = mongoose.model('User', UserSchema);

export { User };