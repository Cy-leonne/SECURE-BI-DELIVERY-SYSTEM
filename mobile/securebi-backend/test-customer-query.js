require('dotenv').config();
const pool = require('./config/db');
const jwt = require('jsonwebtoken');

// Create a test JWT token for customer ID 2
const jwtSecret = process.env.JWT_SECRET || 'securebi-secret';
const testToken = jwt.sign({ id: 2, role: 'customer', name: 'Alice Customer' }, jwtSecret, {
  expiresIn: '8h'
});

console.log('Test token:', testToken);
console.log('\nTesting GET /deliveries/customer/2');

// Query the database directly to see what the customer should get
pool.query('SELECT id, tracking_no, customer_id, status, recipient_name, delivery_address FROM deliveries WHERE customer_id = $1 ORDER BY created_at DESC', [2])
  .then(r => {
    console.log('\nDeliveries for customer ID 2:');
    console.log(r.rows);
    console.log('\nTotal:', r.rows.length);
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
