const express = require('express');
const cors = require('cors');
const MovieRecommender = require('./model');
const { movies, ratings } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

const recommender = new MovieRecommender(100, 1000); // Adjust dimensions based on your data

app.post('/train', async (req, res) => {
    const userIds = ratings.map(r => r.userId);
    const movieIds = ratings.map(r => r.movieId);
    const ratingValues = ratings.map(r => r.rating / 5.0); // Normalize ratings

    try {
        await recommender.train(userIds, movieIds, ratingValues);
        res.json({ message: 'Model trained successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/recommend/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const recommendations = movies.map(movie => ({
        movie: movie.title,
        score: recommender.predict(userId, movie.id)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

    res.json(recommendations);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
