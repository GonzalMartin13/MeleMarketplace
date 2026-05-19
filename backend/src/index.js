import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';
import profilesRouter from './routes/profiles.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mele Marketplace API running' });
});

app.use('/api/posts', postsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`🚀 Mele Marketplace API running on port ${PORT}`);
});
