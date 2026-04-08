import express, { urlencoded } from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(urlencoded({ extended: true }));

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', authRoutes);

// Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});