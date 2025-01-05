import express from 'express';
import cors from 'cors';
import { MovieRecommenderManager } from './tensor/MovieRecommenderManager'; 

const recommender = new MovieRecommenderManager();
recommender.train();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end('Hello World!');
});

app.get('/recommend/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const recommendations = recommender.recommend(userId);

    res.json(recommendations);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});