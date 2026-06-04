require('dotenv').config();
const pool = require('./config/db');

pool.query('SELECT tracking_no, customer_id, status, recipient_name, delivery_address FROM deliveries ORDER BY created_at DESC LIMIT 3')
  .then(r => {
    console.log('Deliveries in database:');
    console.log(r.rows);
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
