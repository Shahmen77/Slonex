import express from 'express';
import { neon } from '@netlify/neon';

const app = express();
const sql = neon(); // автоматически использует env NETLIFY_DATABASE_URL

app.use(express.json());

// Пример: получить все посты
app.get('/posts', async (req, res) => {
  try {
    const posts = await sql`SELECT * FROM posts`;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Пример: получить пост по id
app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [post] = await sql`SELECT * FROM posts WHERE id = ${id}`;
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Пример: создать пост
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const [post] = await sql`INSERT INTO posts (title, content) VALUES (${title}, ${content}) RETURNING *`;
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Neon/Netlify backend example listening on port ${port}`);
}); 