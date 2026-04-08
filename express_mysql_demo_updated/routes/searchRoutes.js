import { Router } from 'express';
import { searchVolunteer } from '../controllers/volunteerController.js';

const router = Router();

router.get('/search', (req, res) => {
    const keyword = req.query.q?.trim();
    if (!keyword) return res.json([]);
    searchVolunteer({ query: { keyword } }, res);
});

export default router;

