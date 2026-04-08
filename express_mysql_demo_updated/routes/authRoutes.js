import { Router } from 'express';

import {
    register,
    login,
    logout
} from '../controllers/authController.js';

import {
    createVolunteer,
    listVolunteers,
    editVolunteer,
    removeVolunteer,
    searchVolunteer
} from '../controllers/volunteerController.js';

import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';
const router = Router();

router.get('/', (req, res) => res.redirect('/login'));

router.get('/register', (req, res) =>
    res.sendFile(process.cwd() + '/views/register.html')
);

router.get('/login', (req, res) =>
    res.sendFile(process.cwd() + '/views/login.html')
);

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/api/user', isAuthenticated, (req, res) => {
    res.json({ isAdmin: req.session.user?.role === 'admin' });
});

router.get('/dashboard', isAuthenticated, (req, res) =>
    res.sendFile(process.cwd() + '/views/dashboard.html')
);


router.post('/volunteer', isAuthenticated, createVolunteer);

router.get('/volunteers', isAuthenticated, (req, res) => res.sendFile(process.cwd() + '/views/volunteer-list.html'));

router.get('/api/volunteers', listVolunteers);

router.post('/volunteer/update/:id', isAdmin, editVolunteer);
router.get('/volunteer/delete/:id', isAdmin, removeVolunteer);

router.get('/volunteer-search', (req, res) => res.sendFile(process.cwd() + '/views/volunteer-search.html'));
// Removed conflicting route

export default router;
