const pool = require('./config/db'); // your existing pool

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected! Current time:', res.rows[0]);
  }
});
