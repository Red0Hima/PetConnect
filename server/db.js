const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.SQLITE_FILE || path.join(__dirname, 'data', 'petconnect.db');

function ensureDataDir() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let db;

function initDb() {
  ensureDataDir();
  db = new sqlite3.Database(dbPath);

  // users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // posts
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author INTEGER NOT NULL,
      caption TEXT,
      imageBase64 TEXT,
      razaId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author) REFERENCES users(id)
    )
  `);

  // likes (many-to-many)
  db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(postId, userId),
      FOREIGN KEY(postId) REFERENCES posts(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);

  return db;
}

// Users
function createUser({ username, email, password }, callback) {
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(sql, [username, email, password], function(err) {
    if (err) return callback(err);
    getUserById(this.lastID, callback);
  });
}

function getUserById(id, callback) {
  const sql = 'SELECT id, username, email, fechaRegistro FROM users WHERE id = ?';
  db.get(sql, [id], callback);
}

function findUserByEmail(email, callback) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], callback);
}

function findUserByUsername(username, callback) {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], callback);
}

function findUserByEmailOrUsername(identifier, callback) {
  const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.get(sql, [identifier, identifier], callback);
}

// Posts
function createPost({ author, caption, imageBase64, razaId }, callback) {
  const sql = 'INSERT INTO posts (author, caption, imageBase64, razaId) VALUES (?, ?, ?, ?)';
  db.run(sql, [author, caption, imageBase64, razaId], function(err) {
    if (err) return callback(err);
    getPostById(this.lastID, callback);
  });
}

function getPostById(id, callback) {
  const sql = 'SELECT * FROM posts WHERE id = ?';
  db.get(sql, [id], (err, post) => {
    if (err) return callback(err);
    if (!post) return callback(null, null);
    
    getUserById(post.author, (err, author) => {
      if (err) return callback(err);
      
      const likeSql = 'SELECT userId FROM likes WHERE postId = ?';
      db.all(likeSql, [id], (err, likes) => {
        if (err) return callback(err);
        const result = Object.assign({}, post, { author, likes: likes ? likes.map(r => r.userId) : [] });
        callback(null, result);
      });
    });
  });
}

function getPosts(filter = {}, callback) {
  let sql = 'SELECT * FROM posts ORDER BY createdAt DESC';
  let params = [];
  
  if (filter.razaId) {
    sql = 'SELECT * FROM posts WHERE razaId = ? ORDER BY createdAt DESC';
    params = [filter.razaId];
  }
  
  db.all(sql, params, (err, rows) => {
    if (err) return callback(err);
    if (!rows || rows.length === 0) return callback(null, []);
    
    let results = [];
    let processed = 0;
    
    rows.forEach(post => {
      getUserById(post.author, (err, author) => {
        const likeSql = 'SELECT userId FROM likes WHERE postId = ?';
        db.all(likeSql, [post.id], (err, likes) => {
          const enriched = Object.assign({}, post, { author, likes: likes ? likes.map(r => r.userId) : [] });
          results.push(enriched);
          processed++;
          if (processed === rows.length) callback(null, results);
        });
      });
    });
  });
}

function toggleLike(postId, userId, callback) {
  const checkSql = 'SELECT id FROM likes WHERE postId = ? AND userId = ?';
  db.get(checkSql, [postId, userId], (err, row) => {
    if (err) return callback(err);
    
    if (row) {
      const deleteSql = 'DELETE FROM likes WHERE id = ?';
      db.run(deleteSql, [row.id], (err) => {
        if (err) return callback(err);
        getPostById(postId, callback);
      });
    } else {
      const insertSql = 'INSERT INTO likes (postId, userId) VALUES (?, ?)';
      db.run(insertSql, [postId, userId], (err) => {
        if (err && err.message.includes('UNIQUE')) {
          // ignore uniqueness errors
          return getPostById(postId, callback);
        }
        if (err) return callback(err);
        getPostById(postId, callback);
      });
    }
  });
}

module.exports = {
  initDb,
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserByEmailOrUsername,
  getUserById,
  createPost,
  getPosts,
  getPostById,
  toggleLike,
};
