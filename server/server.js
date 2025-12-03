require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: '10mb' })); // to accept base64 images
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Servir archivos estáticos desde la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Root - Redirigir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'PaginaPrincipal', 'index.html'));
});

// Init DB and start server
try {
    db.initDb();
    console.log('SQLite DB initialized');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
} catch (err) {
    console.error('DB initialization error:', err.message);
    process.exit(1);
}
