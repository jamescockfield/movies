import mongoose from 'mongoose';
import { GenreType } from '../../types/types';

type GenreDocument = GenreType & mongoose.Document;

const GenreSchema = new mongoose.Schema<GenreDocument>({
    id: Number,
    name: String
});

const Genre = mongoose.model('Genre', GenreSchema);

export { Genre };