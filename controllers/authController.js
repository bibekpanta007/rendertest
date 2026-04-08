import { hash as _hash, compare } from 'bcrypt';
import { create, findByUsername } from '../models/userModel.js';

export function register(req, res) {
    const { username, password } = req.body;

    _hash(password, 10, (err, hash) => {
        if (err) throw err;

        create({ username, password: hash }, (err) => {
            if (err) return res.send('Username already exists');
            res.redirect('/login');
        });
    });
}

export function login(req, res) {
    const { username, password } = req.body;

    findByUsername(username, (err, results) => {
        if (err || results.length === 0)
            return res.send('User not found');

        const user = results[0];

        compare(password, user.password, (err, match) => {
            if (!match) return res.send('Invalid credentials');

            req.session.user = user;
            res.redirect('/dashboard');
        });
    });
}

export function logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
}