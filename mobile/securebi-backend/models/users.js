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

async function createUser({ name, email, password, role, phone }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password, phone, role, biometric_registered, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, name, email, role, phone, biometric_registered, is_active',
      [
        require('crypto').randomUUID(),
        name,
        email.toLowerCase(),
        hashedPassword,
        phone || null,
        role,
        false,
        true,
        new Date(),
      ]
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
      'SELECT id, name, email, role, phone, biometric_registered, is_active FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, phone, biometric_registered, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

async function setUserStatus(id, isActive) {
  try {
    const result = await pool.query(
      'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active',
      [isActive, id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

async function updateUserPassword(email, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id',
      [hashedPassword, email.toLowerCase()]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
}

async function verifyPassword(inputPassword, storedPassword) {
  if (!inputPassword || !storedPassword) {
    return false;
  }

  if (typeof storedPassword !== 'string') {
    return false;
  }

  const isBcryptHash = /^\$2[aby]\$/.test(storedPassword);
  if (isBcryptHash) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      console.error('Error verifying bcrypt password:', error);
      return false;
    }
  }

  return storedPassword === inputPassword;
}

async function updateUserPasswordHash(id, newPassword) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedPassword, id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error updating user password hash:', error);
    throw error;
  }
}

async function registerBiometricForUser(userId, biometricHash) {
  try {
    const result = await pool.query(
      'UPDATE users SET biometric_registered = $1, biometric_hash = $2 WHERE id = $3 RETURNING id, biometric_registered',
      [true, biometricHash, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error registering biometric for user:', error);
    throw error;
  }
}

async function getBiometricHashByUserId(userId) {
  try {
    const result = await pool.query(
      'SELECT biometric_hash FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0]?.biometric_hash || null;
  } catch (error) {
    console.error('Error fetching biometric hash:', error);
    throw error;
  }
}

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
  getAllUsers,
  setUserStatus,
  updateUserPassword,
  verifyPassword,
  updateUserPasswordHash,
  registerBiometricForUser,
  getBiometricHashByUserId,
};
