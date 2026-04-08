import { query } from '../dbConfig/db.js';

export const createUser = (user, callback) => {
    // Check if user exists first
    findUserByUsername(user.username, (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) {
            return callback(new Error('Username already exists'));
        }
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        query(sql, [user.username, user.password, user.role], callback);
    });
};

export const findUserByUsername = (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    query(sql, [username], callback);
};