const express = require('express');
const { getBiometricHashByUserId, registerBiometricForUser } = require('../models/users');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { userId, biometricHash } = req.body;
  if (!userId || !biometricHash) {
    return res.status(400).json({ message: 'User ID and biometricHash are required.' });
  }

  try {
    const user = await registerBiometricForUser(userId, biometricHash);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ success: true, message: 'Biometric template registered.' });
  } catch (error) {
    console.error('Error registering biometric template:', error);
    res.status(500).json({ message: 'Error registering biometric template.' });
  }
});

router.post('/verify', async (req, res) => {
  const { userId, biometricHash } = req.body;
  if (!userId || !biometricHash) {
    return res.status(400).json({ message: 'User ID and biometricHash are required.' });
  }

  try {
    const storedHash = await getBiometricHashByUserId(userId);
    if (!storedHash) {
      return res.status(404).json({ message: 'Biometric template not found for this user.' });
    }

    const verified = storedHash === biometricHash;
    if (verified) {
      return res.json({ success: true, message: 'Biometric verified.' });
    }

    return res.status(401).json({ success: false, message: 'Verification failed.' });
  } catch (error) {
    console.error('Error verifying biometric:', error);
    res.status(500).json({ message: 'Error verifying biometric.' });
  }
});

module.exports = router;
