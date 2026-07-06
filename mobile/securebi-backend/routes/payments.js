const express = require('express');
const authenticate = require('../middleware/auth');
const router = express.Router();
const { getDeliveryById } = require('../models/deliveries');

router.use(authenticate);

// Simulated STK Push endpoint
router.post('/stk-push', async (req, res) => {
  try {
    const { deliveryId, phone } = req.body || {};
    if (!deliveryId || !phone) {
      return res.status(400).json({ message: 'deliveryId and phone are required.' });
    }

    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }

    // In a real implementation you'd call M-Pesa/Lipa APIs here.
    console.log(`Simulating STK Push for delivery ${deliveryId} to phone ${phone}`);

    // Return a simulated checkout id and status
    return res.json({ status: 'initiated', checkoutRequestId: `SIM-${Date.now()}` });
  } catch (error) {
    console.error('Error in STK push:', error);
    return res.status(500).json({ message: 'Failed to initiate STK push.' });
  }
});

// Simulated Paybill endpoint
router.post('/paybill', async (req, res) => {
  try {
    const { deliveryId, phone, amount } = req.body || {};
    if (!deliveryId || !phone || typeof amount !== 'number') {
      return res.status(400).json({ message: 'deliveryId, phone and numeric amount are required.' });
    }

    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }

    console.log(`Simulating Paybill payment for delivery ${deliveryId} from phone ${phone} amount ${amount}`);

    return res.json({ status: 'paid', reference: `PAY-${Date.now()}` });
  } catch (error) {
    console.error('Error in paybill:', error);
    return res.status(500).json({ message: 'Failed to process paybill payment.' });
  }
});

module.exports = router;
