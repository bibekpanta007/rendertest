import { Router } from 'express';
import { listVolunteers, searchVolunteer, removeVolunteer, getSingleVolunteer } from '../controllers/volunteerController.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/volunteers', listVolunteers);

router.get('/search', (req, res) => {
    const keyword = req.query.q?.trim();
    if (!keyword) return res.json([]);
    searchVolunteer({ query: { keyword } }, res);
});

router.get('/delete/:id', removeVolunteer);

router.get('/:id', getSingleVolunteer);

router.get('/update/:id', isAdmin, (req, res) => {
    res.sendFile(process.cwd() + '/views/volunteer-update.html');
});

export default router;

