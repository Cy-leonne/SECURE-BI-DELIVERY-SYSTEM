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

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS biometric_registered BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS biometric_hash VARCHAR(512),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
`;

pool.query(alterSQL)
  .then(r => {
    console.log('✓ Deliveries and users tables updated with new columns');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error updating table:', e.message);
    process.exit(1);
  });
