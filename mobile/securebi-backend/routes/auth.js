const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/users');

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

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, jwtSecret, {
    expiresIn: '8h'
  });

  res.json({ token, user: { id: user.id, role: user.role } });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  const createdUser = await createUser({ name, email, password, role });
  res.json({ message: 'User registered successfully', user: { id: createdUser.id, role: createdUser.role } });
});

module.exports = router;
