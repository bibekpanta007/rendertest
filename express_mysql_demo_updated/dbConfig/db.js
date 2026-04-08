import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Bibek@007',
    database: 'volunteer_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => {
        console.log('MySQL Pool Connected...');
    })
    .catch(err => {
        console.error('DB Connection failed:', err.message);
    });

export const query = (sql, params = [], callback) => {
    pool.execute(sql, params)
        .then(([results]) => callback(null, results))
        .catch(err => callback(err));
};
