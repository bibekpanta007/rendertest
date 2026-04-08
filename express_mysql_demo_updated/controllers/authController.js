import { hash, compare } from 'bcrypt';
import { createUser, findUserByUsername } from '../models/userModel.js';

export function register(req, res) {
    const { username, password, role, confirmPassword } = req.body;

    // Basic validation
    if (!username || !password || !role) {
        return res.redirect('/register?error=missingFields');
    }
    if (password.length < 6) {
        return res.redirect('/register?error=shortPassword');
    }
    if (password !== confirmPassword) {
        return res.redirect('/register?error=passMismatch');
    }
    if (!['user', 'admin'].includes(role)) {
        return res.redirect('/register?error=invalidRole');
    }

    hash(password, 12, (err, hashedPassword) => {
        if (err) {
            console.error('Hash error:', err);
            return res.status(500).send('Server error');
        }

        createUser(
            { username, password: hashedPassword, role },
            (err) => {
                if (err) {
                    if (err.message === 'Username already exists') {
                        return res.redirect(`/register?error=usernameExists`);
                    }
                    console.error('Create user error:', err);
                    return res.redirect('/register?error=failed');
                }
                res.redirect('/login');
            }
        );
    });
}

export function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/login?error=missingFields');
    }

    findUserByUsername(username, (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.redirect('/login?error=serverError');
        }
        if (results.length === 0) {
            return res.redirect('/login?error=userNotFound');
        }

        const user = results[0];

        compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Compare error:', err);
                return res.redirect('/login?error=serverError');
            }
            if (!match) {
                return res.redirect('/login?error=invalidPassword');
            }

            // Don't store password in session
            const { password: _, ...sessionUser } = user;
            req.session.user = sessionUser;
            res.redirect('/dashboard');
        });
    });
}

export function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}
