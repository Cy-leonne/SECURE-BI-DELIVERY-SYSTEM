require('dotenv').config();
const pool = require('./config/db');

const alterSQL = `
ALTER TABLE deliveries 
ADD COLUMN IF NOT EXISTS item_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category VARCHAR(255),
ADD COLUMN IF NOT EXISTS estimated_weight VARCHAR(50),
ADD COLUMN IF NOT EXISTS recipient_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(255),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS special_instructions TEXT;
`;

pool.query(alterSQL)
  .then(r => {
    console.log('✓ Deliveries table updated with new columns');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error updating table:', e.message);
    process.exit(1);
  });
