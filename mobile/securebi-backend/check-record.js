require('dotenv').config();
const pool = require('./config/db');

pool.query('SELECT * FROM deliveries LIMIT 1')
  .then(r => {
    console.log('Sample delivery record:');
    console.log(JSON.stringify(r.rows[0], null, 2));
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
