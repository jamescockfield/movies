import express from 'express';
import cors from 'cors';
import { recommender } from './utils';
import { MovieRating } from '../database/model/MovieRating';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end('Hello World!');
});

app.get('/recommend/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const recommendations = await recommender.recommend(userId);
    const ratings = await MovieRating.find({ userId });

    res.json({ ratings, recommendations });
});

export { app };