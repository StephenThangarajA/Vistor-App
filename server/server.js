const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        apartmentName VARCHAR(255) NOT NULL,
        vehicleType VARCHAR(100) NOT NULL,
        vehicleNumber VARCHAR(50) NOT NULL,
        purposeOfVisit TEXT NOT NULL,
        durationOfVisit VARCHAR(100) NOT NULL,
        dateOfVisit DATE NOT NULL,
        timeOfVisit TIME NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = users[0];
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

app.post('/api/entries', async (req, res) => {
  try {
    const {
      username,
      apartmentName,
      vehicleType,
      vehicleNumber,
      purposeOfVisit,
      durationOfVisit,
      dateOfVisit,
      timeOfVisit
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO visitors (
        username, apartmentName, vehicleType, vehicleNumber,
        purposeOfVisit, durationOfVisit, dateOfVisit, timeOfVisit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, apartmentName, vehicleType, vehicleNumber, purposeOfVisit, durationOfVisit, dateOfVisit, timeOfVisit]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create visitor entry'
    });
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM visitors ORDER BY createdAt DESC');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visitor entries'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 