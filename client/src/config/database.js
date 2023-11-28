// database.js
const mysql = require('mysql');

// MySQL database configuration
const dbConfig = {
  host: 'your-database-host',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Wrap the pool in a promise for easier async/await handling
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, values, (error, results) => {
        connection.release();

        if (error) {
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  });
};

module.exports = query;
