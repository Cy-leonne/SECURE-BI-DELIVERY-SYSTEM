const express = require('express');
const authenticate = require('../middleware/auth');
const {
  addDelivery,
  assignDelivery,
  verifyRecipient,
  getPodForDelivery,
  getDeliveryById,
  getDeliveryByTrackingNo,
  getDeliveriesByCustomer,
  getDeliveriesByCourier,
  startDelivery,
  confirmDelivery
} = require('../models/deliveries');

const router = express.Router();
router.use(authenticate);

function normalizeDelivery(delivery) {
  if (!delivery) return null;
  return {
    id: delivery.id,
    trackingNo: delivery.tracking_no,
    customerId: delivery.customer_id,
    courierId: delivery.courier_id,
    status: delivery.status,
    item: delivery.item_name,
    description: delivery.description,
    category: delivery.category,
    estimatedWeight: delivery.estimated_weight,
    recipientName: delivery.recipient_name,
    recipientPhone: delivery.recipient_phone,
    deliveryAddress: delivery.delivery_address,
    city: delivery.city,
    postalCode: delivery.postal_code,
    specialInstructions: delivery.special_instructions,
    createdAt: delivery.created_at,
    updatedAt: delivery.updated_at,
    createdBy: delivery.created_by,
  };
}

router.get('/courier/:courierId', async (req, res) => {
  try {
    const { courierId } = req.params;
    const deliveries = await getDeliveriesByCourier(courierId);
    res.json({ deliveries: deliveries.map(normalizeDelivery) });
  } catch (error) {
    console.error('Error in GET /courier/:courierId:', error);
    res.status(500).json({ message: 'Error fetching courier deliveries' });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const deliveries = await getDeliveriesByCustomer(customerId);
    const normalized = deliveries.map((delivery) => ({
      ...delivery,
      trackingNo: delivery.tracking_no,
      item: delivery.item_name,
      deliveryAddress: delivery.delivery_address,
      recipientName: delivery.recipient_name,
      recipientPhone: delivery.recipient_phone,
      postalCode: delivery.postal_code,
      specialInstructions: delivery.special_instructions,
      estimatedWeight: delivery.estimated_weight,
      createdAt: delivery.created_at,
      updatedAt: delivery.updated_at,
    }));
    res.json({ deliveries: normalized });
  } catch (error) {
    console.error('Error in GET /customer/:customerId:', error);
    res.status(500).json({ message: 'Error fetching customer deliveries' });
  }
});

router.get('/available/pending', async (req, res) => {
  try {
    const pool = require('../config/db');
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE courier_id IS NULL AND status = $1 ORDER BY created_at DESC',
      ['Pending']
    );
    res.json({ deliveries: result.rows.map(normalizeDelivery) });
  } catch (error) {
    console.error('Error in GET /available/pending:', error);
    res.status(500).json({ message: 'Error fetching available deliveries' });
  }
});

router.get('/tracking/:trackingNo', async (req, res) => {
  try {
    const { trackingNo } = req.params;
    const delivery = await getDeliveryByTrackingNo(trackingNo);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    res.json(normalizeDelivery(delivery));
  } catch (error) {
    console.error('Error in GET /tracking/:trackingNo:', error);
    res.status(500).json({ message: 'Error retrieving delivery' });
  }
});

router.get('/:deliveryId', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    res.json(normalizeDelivery(delivery));
  } catch (error) {
    console.error('Error in GET /:deliveryId:', error);
    res.status(500).json({ message: 'Error retrieving delivery' });
  }
});

router.post('/:deliveryId/start', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await startDelivery(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }
    res.json(delivery);
  } catch (error) {
    console.error('Error in POST /:deliveryId/start:', error);
    res.status(500).json({ message: 'Error starting delivery' });
  }
});

router.post('/:deliveryId/confirm', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const pod = await confirmDelivery(deliveryId);
    if (!pod) {
      return res.status(404).json({ message: 'Proof of delivery not found.' });
    }
    res.json(pod);
  } catch (error) {
    console.error('Error in POST /:deliveryId/confirm:', error);
    res.status(500).json({ message: 'Error confirming delivery' });
  }
});

router.post('/:deliveryId/verify-recipient', async (req, res) => {
  try {
    const { recipientId, biometricMatched } = req.body;
    const { deliveryId } = req.params;
    if (!recipientId || typeof biometricMatched !== 'boolean') {
      return res.status(400).json({ message: 'Recipient ID and biometricMatched are required.' });
    }

    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }

    const result = await verifyRecipient(deliveryId, recipientId, biometricMatched);
    if (!result) {
      return res.status(400).json({ message: 'Recipient verification failed.' });
    }

    res.json({ proofRecorded: result.proofRecorded });
  } catch (error) {
    console.error('Error in POST /:deliveryId/verify-recipient:', error);
    res.status(500).json({ message: 'Error verifying recipient' });
  }
});

router.get('/:deliveryId/pod', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const pod = await getPodForDelivery(deliveryId);
    if (!pod) {
      return res.status(404).json({ message: 'Proof of delivery not found.' });
    }

    res.json(pod);
  } catch (error) {
    console.error('Error in GET /:deliveryId/pod:', error);
    res.status(500).json({ message: 'Error retrieving proof of delivery' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { trackingNo, customerId, orderId } = req.body;
    const resolvedCustomerId = customerId || req.body.customer_id || req.user?.id;
    const resolvedTrackingNo = trackingNo || req.body.tracking_no || orderId || `TRK-${Date.now().toString().slice(-6)}`;

    if (!resolvedTrackingNo || !resolvedCustomerId) {
      console.error('Invalid delivery POST body:', req.body, 'user:', req.user);
      return res.status(400).json({ message: 'Tracking number and customer ID are required.' });
    }

    const delivery = await addDelivery({
      ...req.body,
      trackingNo: resolvedTrackingNo,
      customerId: resolvedCustomerId,
      createdBy: req.user?.id || resolvedCustomerId,
    });
    res.status(201).json({
      id: delivery.id,
      trackingNo: delivery.tracking_no,
      status: delivery.status,
      item: delivery.item_name,
      description: delivery.description,
      category: delivery.category,
      estimatedWeight: delivery.estimated_weight,
      recipientName: delivery.recipient_name,
      recipientPhone: delivery.recipient_phone,
      deliveryAddress: delivery.delivery_address,
      city: delivery.city,
      postalCode: delivery.postal_code,
      specialInstructions: delivery.special_instructions,
      createdAt: delivery.created_at,
      updatedAt: delivery.updated_at,
    });
  } catch (error) {
    console.error('Error in POST /:', error);
    res.status(500).json({ message: 'Error creating delivery' });
  }
});

router.post('/:deliveryId/assign', async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { courierId, courier_id: courierIdSnake } = req.body || {};
    const courierQueryId = req.query?.courierId || req.query?.courier_id;
    const courierIdentifier = courierId || courierIdSnake || courierQueryId || req.user?.id;

    if (!courierIdentifier) {
      console.error('Assign delivery failed: missing courierId in request body/query and auth payload', {
        body: req.body,
        query: req.query,
        user: req.user,
      });
      return res.status(400).json({ message: 'Courier ID is required.' });
    }

    const delivery = await assignDelivery(deliveryId, courierIdentifier);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }

    res.json({ id: delivery.id, courierId: delivery.courier_id, status: delivery.status });
  } catch (error) {
    console.error('Error in POST /:deliveryId/assign:', error);
    res.status(500).json({ message: 'Error assigning delivery' });
  }
});

module.exports = router;
