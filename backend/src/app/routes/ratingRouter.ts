import express from 'express';
import { MovieRating } from '../../database/model/MovieRating';
import { validateRequest } from '../validation/validationMiddleware';
import { movieRatingSchema } from '../validation/schema/movieRating';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const rating = await MovieRating.findById(req.params.id);
    if (!rating) {
        res.status(404).json({ error: 'Rating not found' });
        return;
    }
    res.json(rating);
});

router.post('/', validateRequest(movieRatingSchema), async (req, res) => {
    const { userId, movieId, rating } = req.body;

    const movieRating = new MovieRating({ userId, movieId, rating });
    await movieRating.save();
    res.status(201).json(movieRating);
});

router.put('/:id', validateRequest(movieRatingSchema), async (req, res) => {
    const { rating } = req.body;
    
    const updatedRating = await MovieRating.findByIdAndUpdate(
        req.params.id,
        { rating },
        { new: true }
    );

    if (!updatedRating) {
        res.status(404).json({ error: 'Rating not found' });
        return;
    }

    res.json(updatedRating);
});

router.delete('/:id', async (req, res) => {
    const rating = await MovieRating.findByIdAndDelete(req.params.id);
    if (!rating) {
        res.status(404).json({ error: 'Rating not found' });
        return;
    }
    res.status(204).end();
});

export { router as ratingRouter };