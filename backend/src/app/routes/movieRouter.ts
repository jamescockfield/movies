import express from 'express';
import { Movie } from '../../database/model/Movie';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = await Movie.findOne({ sequentialId: movieId });
    
    if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
    }

    res.json(movie);
});

export { router as movieRouter };