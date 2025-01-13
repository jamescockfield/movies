import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.end('Hello World!');
});

const handler = serverless(app);

export { handler };