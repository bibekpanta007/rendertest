import { query } from '../dbConfig/db.js';

export const addVolunteer = (data, cb) => {
    const sql = 'INSERT INTO volunteer (firstname, lastname, email, phone) VALUES (?, ?, ?, ?)';
    query(sql, [data.firstname, data.lastname, data.email, data.phone], cb);
};

export const getVolunteers = (cb) => {
    query('SELECT * FROM volunteer', [], cb);
};

export const updateVolunteer = (id, data, cb) => {
    const sql = 'UPDATE volunteer SET firstname=?, lastname=?, email=?, phone=? WHERE id=?';
    query(sql, [data.firstname, data.lastname, data.email, data.phone, id], cb);
};

export const deleteVolunteer = (id, cb) => {
    query('DELETE FROM volunteer WHERE id=?', [id], cb);
};

export const searchVolunteers = (keyword, cb) => {
    const sql = 'SELECT * FROM volunteer WHERE firstname LIKE ? OR lastname LIKE ? OR CONCAT(firstname, " ", lastname) LIKE ?';
    query(sql, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], cb);
};

export const getVolunteerById = (id, cb) => {
    query('SELECT * FROM volunteer WHERE id = ?', [id], cb);
};


