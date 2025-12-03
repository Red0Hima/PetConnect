const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    // Check existing
    db.findUserByEmail(email, async (err, existingEmail) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

      db.findUserByUsername(username, async (err, existingUser) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (existingUser) return res.status(400).json({ message: 'Username already taken' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        db.createUser({ username, email, password: hashed }, (err, created) => {
          if (err) return res.status(500).json({ message: 'Server error' });

          const token = jwt.sign({ id: created.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

          res.json({ user: { id: created.id, username: created.username, email: created.email }, token });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login (accepts email OR username)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or username
    if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' });

    db.findUserByEmailOrUsername(identifier, async (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
