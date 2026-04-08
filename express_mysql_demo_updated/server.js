import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// No helmet CSP - completely disable for dev to allow inline scripts
// app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secure-secret-key-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/', authRoutes);
app.use('/api', searchRoutes);
app.use('/volunteer', volunteerRoutes);

app.use((req, res) => {
    res.status(404).send('Not Found');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
