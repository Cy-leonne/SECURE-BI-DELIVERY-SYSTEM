require('dotenv').config();
const pool = require('./config/db');

pool.query('SELECT id, name, email, role FROM users LIMIT 5')
  .then(r => {
    console.log('Users in database:');
    console.log(r.rows);
    
    if (r.rows.length > 0) {
      console.log('\nTest: Attempting to create a delivery for user ID', r.rows[0].id);
      const customerId = r.rows[0].id;
      const trackingNo = `TRK-${Date.now().toString().slice(-6)}`;
      
      return pool.query(
        'INSERT INTO deliveries (tracking_no, customer_id, created_by, status, recipient_name, delivery_address, city) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [trackingNo, customerId, customerId, 'Pending', 'Test Recipient', '123 Test St', 'Nairobi']
      );
    }
  })
  .then(result => {
    if (result) {
      console.log('\n✓ Successfully created test delivery:');
      console.log(result.rows[0]);
    }
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
