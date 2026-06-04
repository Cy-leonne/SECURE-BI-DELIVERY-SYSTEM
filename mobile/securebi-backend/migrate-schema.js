require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const pool = require('./config/db');

async function migrate() {
  try {
    // Step 1: Check if users table has UUID IDs
    const usersCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id'
    `);
    
    console.log('Checking users table schema...');
    console.log('Users ID type:', usersCheck.rows[0]?.data_type || 'NOT FOUND');

    // Step 2: Drop the old deliveries table if it has wrong structure
    console.log('Dropping old deliveries table...');
    await pool.query('DROP TABLE IF EXISTS deliveries CASCADE');

    // Step 3: Create the correct deliveries table with integer IDs to match users table
    console.log('Creating new deliveries table with correct schema...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id SERIAL PRIMARY KEY,
        tracking_no VARCHAR(255) UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL REFERENCES users(id),
        created_by INTEGER NOT NULL REFERENCES users(id),
        courier_id INTEGER REFERENCES users(id),
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        item_name VARCHAR(255),
        description TEXT,
        category VARCHAR(255),
        estimated_weight VARCHAR(50),
        recipient_name VARCHAR(255),
        recipient_phone VARCHAR(20),
        delivery_address TEXT,
        city VARCHAR(255),
        postal_code VARCHAR(20),
        special_instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Step 4: Create indexes
    console.log('Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_deliveries_customer_id ON deliveries(customer_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_deliveries_courier_id ON deliveries(courier_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_no ON deliveries(tracking_no)');

    // Step 5: Drop old pods table if it exists
    await pool.query('DROP TABLE IF EXISTS pods CASCADE');

    // Step 6: Create correct pods table
    console.log('Creating new pods table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pods (
        id SERIAL PRIMARY KEY,
        delivery_id INTEGER NOT NULL REFERENCES deliveries(id),
        recipient_id INTEGER NOT NULL REFERENCES users(id),
        verified BOOLEAN DEFAULT FALSE,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Migration completed successfully!');
    console.log('✓ Deliveries table recreated with correct schema');
    console.log('✓ All indexes created');
    console.log('✓ Ready to accept new orders');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

migrate();
