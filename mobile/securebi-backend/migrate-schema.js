const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const statements = schemaSql
      .split(/;\s*\n/)
      .map((stmt) => stmt.trim())
      .filter(Boolean);

    console.log('Applying schema from schema.sql...');
    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log('✓ Database schema created or verified successfully.');
    console.log('You can now run `npm start` to start the backend.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();
