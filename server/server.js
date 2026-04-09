const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-secret';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// PostgreSQL connection (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Helper functions
const runQuery = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result;
};
const getQuery = async (query, params = []) => {
  const result = await pool.query(query, params);
  return result.rows;
};

const generateSlug = (str) => str.replace(/^\d+\.\s*/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf-8'));
const projectsSeed = seedData.projects;
const blogsSeed = seedData.blogs;

const initDB = async () => {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT
      )
    `);
    await runQuery(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        sort_order INTEGER DEFAULT 0,
        title TEXT,
        slug TEXT UNIQUE,
        description TEXT,
        full_details TEXT,
        link TEXT,
        image TEXT,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await runQuery(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT,
        slug TEXT UNIQUE,
        content TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await runQuery(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const users = await getQuery("SELECT * FROM users WHERE email = 'admin@portfolio.com'");
    if (users.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await runQuery("INSERT INTO users (email, password) VALUES ($1, $2)", ['admin@portfolio.com', hash]);
    }

    const projects = await getQuery("SELECT COUNT(*) as count FROM projects");
    if (parseInt(projects[0].count) === 0) {
      let activeOrder = 0;
      for (const p of projectsSeed) {
        await runQuery(
          "INSERT INTO projects (title, sort_order, slug, description, full_details, link, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [p.title, activeOrder++, generateSlug(p.title), p.description, p.full_details, p.link, p.image, typeof p.tags === 'string' ? p.tags : JSON.stringify(p.tags)]
        );
      }
    }

    const blogs = await getQuery("SELECT COUNT(*) as count FROM blogs");
    if (parseInt(blogs[0].count) === 0) {
      for (const b of blogsSeed) {
        await runQuery(
          "INSERT INTO blogs (title, slug, content, image) VALUES ($1, $2, $3, $4)",
          [b.title, generateSlug(b.title), b.content, b.image]
        );
      }
      console.log("Seeded Projects & Blogs successfully!");
    }

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
};
initDB();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await getQuery("SELECT * FROM users WHERE email = $1", [email]);
  if (!users.length) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, users[0].password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: users[0].id, email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: email });
});

app.get('/api/projects', async (req, res) => res.json(await getQuery("SELECT * FROM projects ORDER BY sort_order ASC, id ASC")));
app.get('/api/projects/:slug', async (req, res) => {
  const rows = await getQuery("SELECT * FROM projects WHERE slug = $1", [req.params.slug]);
  if (!rows.length) return res.status(404).json({error: "Not Found"});
  res.json(rows[0]);
});
app.post('/api/projects', authMiddleware, async (req, res) => {
  const { title, description, full_details, link, image, tags } = req.body;
  const slug = generateSlug(title);

  const currentMax = await getQuery("SELECT COALESCE(MAX(sort_order), 0) as count FROM projects");
  const newSort = parseInt(currentMax[0].count) + 1;

  const result = await runQuery(
    "INSERT INTO projects (title, sort_order, slug, description, full_details, link, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    [title, newSort, slug, description, full_details, link, image, typeof tags === 'string' ? tags : JSON.stringify(tags)]
  );
  res.json({ id: result.rows[0].id, slug });
});

app.put('/api/projects/reorder', authMiddleware, async (req, res) => {
  const { items } = req.body;
  for (const item of items) {
    if (item.id && item.sort_order !== undefined) {
      await runQuery("UPDATE projects SET sort_order=$1 WHERE id=$2", [item.sort_order, item.id]);
    }
  }
  res.json({ success: true });
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { title, description, full_details, link, image, tags } = req.body;
  const slug = generateSlug(title);
  await runQuery(
    "UPDATE projects SET title=$1, slug=$2, description=$3, full_details=$4, link=$5, image=$6, tags=$7 WHERE id=$8",
    [title, slug, description, full_details, link, image, typeof tags === 'string' ? tags : JSON.stringify(tags), req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  await runQuery("DELETE FROM projects WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

app.get('/api/blogs', async (req, res) => res.json(await getQuery("SELECT * FROM blogs ORDER BY id DESC")));
app.get('/api/blogs/:slug', async (req, res) => {
  const rows = await getQuery("SELECT * FROM blogs WHERE slug = $1", [req.params.slug]);
  if (!rows.length) return res.status(404).json({error: "Not Found"});
  res.json(rows[0]);
});
app.post('/api/blogs', authMiddleware, async (req, res) => {
  const { title, content, image } = req.body;
  const slug = generateSlug(title);
  const result = await runQuery(
    "INSERT INTO blogs (title, slug, content, image) VALUES ($1, $2, $3, $4) RETURNING id",
    [title, slug, content, image]
  );
  res.json({ id: result.rows[0].id, slug });
});
app.put('/api/blogs/:id', authMiddleware, async (req, res) => {
  const { title, content, image } = req.body;
  const slug = generateSlug(title);
  await runQuery(
    "UPDATE blogs SET title=$1, slug=$2, content=$3, image=$4 WHERE id=$5",
    [title, slug, content, image, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/blogs/:id', authMiddleware, async (req, res) => {
  await runQuery("DELETE FROM blogs WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  await runQuery("INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)", [name, email, message]);
  res.json({ success: true });
});
app.get('/api/contacts', authMiddleware, async (req, res) => res.json(await getQuery("SELECT * FROM contacts ORDER BY id DESC")));
app.delete('/api/contacts/:id', authMiddleware, async (req, res) => {
  await runQuery("DELETE FROM contacts WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

app.get('/api/cv', (req, res) => {
  const cvPath = path.join(__dirname, '../cv.pdf');
  if (fs.existsSync(cvPath)) {
    res.download(cvPath, 'Aayush_Bhandari_CV.pdf');
  } else {
    res.status(404).send('CV not found.');
  }
});

app.post('/api/cv', authMiddleware, (req, res) => {
  const { base64Data } = req.body;
  if (!base64Data) return res.status(400).json({ error: "No data provided" });
  try {
    const base64String = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64String, 'base64');
    fs.writeFileSync(path.join(__dirname, '../cv.pdf'), buffer);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend live on ${PORT}`));
