import express from 'express';
import { MovieRating } from '../../database/model/MovieRating';
import { recommender } from '../utils';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const recommendations = await recommender.recommend(userId);
    const ratings = await MovieRating.find({ userId });

    res.json({ ratings, recommendations });
});

export { router as recommendRouter };