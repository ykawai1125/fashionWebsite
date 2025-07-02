const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yaseino0602!',
  database: 'fashion_db'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle registration

app.post('/register', (req, res) => {
  const { username, email, password, height } = req.body;
  const sql = 'INSERT INTO users (username, email, password, height) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, email, password, height], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Failed to create account');
    } else {
      console.log('User registered:', result.insertId);
      res.status(200).send('Account created successfully');
    }
  });
});


// Handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT username FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.status(200).json({ username: results[0].username });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});
//saving img in database
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.post('/upload', upload.single('image'), (req, res) => {
  const { user_id } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  db.query(
    'INSERT INTO posts (user_id, image_path) VALUES (?, ?)',
    [user_id, imagePath],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ success: true, imagePath });
    }
  );
});

app.get('/posts/:user_id', (req, res) => {
  db.query(
    'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
    [req.params.user_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.get('/api/users', (req, res) => {
  const sql = 'SELECT id, username, height FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Endpoint to get a single post by ID with user info
app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  const query = `
    SELECT posts.image_path, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching post:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = results[0];
    res.json({
      image_path: post.image_path,
      username: post.username
    });
  });
});

app.get('/api/user-thumbnails', (req, res) => {
  const sql = `
    SELECT u.id, u.username, p.image_path
    FROM users u
    LEFT JOIN posts p ON p.id = (
      SELECT id FROM posts
      WHERE user_id = u.id
      ORDER BY id DESC
      LIMIT 1
    )
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching user thumbnails:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
