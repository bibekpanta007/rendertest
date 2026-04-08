import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// Middleware
// ======================
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'super_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Serve static files (CSS/JS if needed)
app.use(express.static(path.join(__dirname, 'views')));

// ======================
// MySQL Connection Pool
// ======================
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Bibek@007',
    database: 'volunteer_db'
});

pool.getConnection()
    .then(() => console.log('MySQL Connected'))
    .catch(err => console.error('DB Error:', err.message));

// ======================
// Auth Middleware
// ======================
const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

// ======================
// ROUTES
// ======================

// Root → Login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup Page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Dashboard (Protected)
app.get('/dashboard', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// ======================
// SIGNUP
// ======================
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.redirect('/login');

    } catch (err) {
        res.send('Signup error: ' + err.message);
    }
});

// ======================
// LOGIN
// ======================
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.send('User not found');
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('Invalid password');
        }

        // Save session
        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.redirect('/dashboard');

    } catch (err) {
        res.send('Login error: ' + err.message);
    }
});

// ======================
// LOGOUT
// ======================
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});