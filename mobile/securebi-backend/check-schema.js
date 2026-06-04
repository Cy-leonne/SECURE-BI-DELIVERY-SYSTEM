require('dotenv').config();
const pool = require('./config/db');

pool.query(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'deliveries' 
  ORDER BY ordinal_position
`)
  .then(r => {
    console.log('Deliveries table columns:');
    r.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    process.exit(0);
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });
