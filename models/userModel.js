import pool from '../dbConfig/db.js';

export function create(user, callback) {
    pool.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [user.username, user.password],
        callback
    );
}

export function findByUsername(username, callback) {
    pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        callback
    );
}