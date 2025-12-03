const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to authenticate JWT
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Create post (expects { caption, imageBase64, razaId })
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { caption, imageBase64, razaId } = req.body;
    const author = req.userId;
    db.createPost({ author, caption, imageBase64, razaId }, (err, post) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(post);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts for a razaId
router.get('/', async (req, res) => {
  try {
    const { razaId } = req.query;
    const filter = razaId ? { razaId } : {};
    db.getPosts(filter, (err, posts) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(posts);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle like
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    db.getPostById(postId, (err, existing) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!existing) return res.status(404).json({ message: 'Post not found' });
      
      const userId = req.userId;
      db.toggleLike(postId, userId, (err, post) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(post);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
