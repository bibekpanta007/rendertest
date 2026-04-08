import { Router } from 'express';
const router = Router();
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

router.get('/',(req,res)=>{
    res.redirect('/login')
})
router.get('/register', (req, res) => {
    res.sendFile(process.cwd() + '/views/register.html');
});

router.get('/login', (req, res) => {
    res.sendFile(process.cwd()  + '/views/login.html');
});

router.post('/register', register);
router.post('/login', login);

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(process.cwd()  + '/views/dashboard.html');
});

router.get('/logout', logout);

export default router;