const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function findUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

async function createUser({ name, email, password, role }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email.toLowerCase(), hashedPassword, role, new Date()]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  getUserById
};
