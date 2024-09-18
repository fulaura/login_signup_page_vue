// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = 3000;
const saltRounds = 10;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Route to handle user registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const queryText = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
  try {
    const result = await pool.query(queryText, [username, hashedPassword]);
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const queryText = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await pool.query(queryText, [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.get('/api/users', async (req, res) => {
    const { username } = req.query;
  
    const queryText = 'SELECT 1 FROM users WHERE username = $1';
    try {
      const result = await pool.query(queryText, [username]);
      if (result.rows.length > 0) {
        res.status(200).json({ exists: 0 });
      } else {
        res.status(404).json({ exists: 1 });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error checking username' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
