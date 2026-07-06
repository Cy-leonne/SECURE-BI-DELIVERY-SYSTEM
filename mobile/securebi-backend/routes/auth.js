const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, updateUserPassword, verifyPassword, updateUserPasswordHash } = require('../models/users');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'securebi-secret';

router.post('/login/password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  if (user.is_active === false) {
    return res.status(403).json({ message: 'This account is currently deactivated.' });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  if (typeof user.password === 'string' && !/^\$2[aby]\$/.test(user.password)) {
    await updateUserPasswordHash(user.id, password);
  }

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, jwtSecret, {
    expiresIn: '8h'
  });

  res.json({ token, user: { id: user.id, role: user.role } });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  const createdUser = await createUser({ name, email, password, role, phone });
  res.json({
    message: 'User registered successfully',
    user: {
      id: createdUser.id,
      role: createdUser.role,
    },
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  const updated = await updateUserPassword(email, newPassword);
  if (!updated) {
    return res.status(404).json({ message: 'No user found with that email address.' });
  }

  res.json({ message: 'Password has been reset successfully.' });
});

router.post('/login/biometric', async (req, res) => {
  const { userIdentifier, biometricHash } = req.body;
  if (!userIdentifier || !biometricHash) {
    return res.status(400).json({ message: 'User identifier and biometricHash are required.' });
  }

  try {
    const { getUserById, getBiometricHashByUserId, findUserByEmail } = require('../models/users');
    let user = null;

    if (typeof userIdentifier === 'string' && userIdentifier.includes('@')) {
      user = await findUserByEmail(userIdentifier);
    }

    if (!user) {
      user = await getUserById(userIdentifier);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: 'This account is currently deactivated.' });
    }

    const storedHash = await getBiometricHashByUserId(user.id);
    if (!storedHash) {
      return res.status(400).json({ message: 'Biometric not registered for this user.' });
    }

    const verified = storedHash === biometricHash;
    if (!verified) {
      return res.status(401).json({ message: 'Biometric verification failed.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, jwtSecret, {
      expiresIn: '8h'
    });

    res.json({ token, user: { id: user.id, role: user.role, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error during biometric login:', error);
    res.status(500).json({ message: 'Biometric login error.' });
  }
});

module.exports = router;
