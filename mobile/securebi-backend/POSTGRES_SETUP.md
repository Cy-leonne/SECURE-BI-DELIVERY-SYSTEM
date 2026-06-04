# PostgreSQL Setup Guide

## Environment Variables

Add these to your `.env` file in the `securebi-backend` directory:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=securebi_db
DB_PASS=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```

## Database Setup

1. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE securebi_db;
   ```

2. **Run Schema Migration:**
   ```bash
   psql -U postgres -d securebi_db -f schema.sql
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

## Required Tables

The schema creates the following tables:
- **users** - User accounts (couriers, customers)
- **deliveries** - Delivery records
- **pods** - Proof of Delivery records

## Starting the Backend

```bash
npm start
```

The server will connect to PostgreSQL on startup.

## Default User Creation

To create default users for testing, add this to `src/index.js` after the database connection:

```javascript
// Insert seed data (run once)
const seedUsers = async () => {
  const userModel = require('../models/users');
  try {
    await userModel.createUser({
      name: 'John Courier',
      email: 'courier@example.com',
      password: 'password123',
      role: 'courier'
    });
    await userModel.createUser({
      name: 'Jane Customer',
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    });
    console.log('Seed data created');
  } catch (error) {
    console.log('Seed data already exists or error:', error.message);
  }
};

seedUsers();
```
