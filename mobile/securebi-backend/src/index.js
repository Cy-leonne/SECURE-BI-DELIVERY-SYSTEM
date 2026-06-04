const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const deliveryRoutes = require('../routes/deliveries');
const biometricRoutes = require('../routes/biometric');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/biometric', biometricRoutes);

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SecureBi backend running on port ${PORT}`));
