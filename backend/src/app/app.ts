import express from 'express';
import cors from 'cors';
import { movieRouter } from './routes/movieRouter';
import { userRouter } from './routes/userRouter';
import { ratingRouter } from './routes/ratingRouter';
import { recommendRouter } from './routes/recommendRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/movies', movieRouter);
app.use('/users', userRouter);
app.use('/ratings', ratingRouter);
app.use('/recommend', recommendRouter);

app.get('/', (req, res) => {
    res.end('Hello World!');
});

export { app };