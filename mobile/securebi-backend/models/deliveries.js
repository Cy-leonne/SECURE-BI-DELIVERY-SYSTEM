const pool = require('../config/db');

async function addDelivery({ trackingNo, customerId, createdBy, item, description, category, estimatedWeight, recipientName, recipientPhone, deliveryAddress, city, postalCode, specialInstructions }) {
  try {
    // IDs are UUIDs; accept the strings from the frontend as-is
    const cusId = customerId;
    const createdById = createdBy || cusId;
    const id = require('crypto').randomUUID();

    const result = await pool.query(
      'INSERT INTO deliveries (id, tracking_no, customer_id, created_by, courier_id, status, item_name, description, category, estimated_weight, recipient_name, recipient_phone, delivery_address, city, postal_code, special_instructions, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *',
      [
        id,
        trackingNo,
        cusId,
        createdById,
        null,
        'Pending',
        item,
        description,
        category,
        estimatedWeight,
        recipientName,
        recipientPhone,
        deliveryAddress,
        city,
        postalCode,
        specialInstructions,
        new Date(),
        new Date()
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding delivery:', error);
    throw error;
  }
}

async function getDeliveriesByCustomer(customerId) {
  try {
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE customer_id = $1 ORDER BY updated_at DESC',
      [customerId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting deliveries by customer:', error);
    throw error;
  }
}

async function getDeliveryById(deliveryId) {
  try {
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE id = $1',
      [deliveryId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting delivery:', error);
    throw error;
  }
}

async function getDeliveriesByCourier(courierId) {
  try {
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE courier_id = $1 ORDER BY updated_at DESC',
      [courierId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting deliveries by courier:', error);
    throw error;
  }
}

async function getDeliveryByTrackingNo(trackingNo) {
  try {
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE tracking_no = $1',
      [trackingNo]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting delivery by tracking no:', error);
    throw error;
  }
}

async function startDelivery(deliveryId) {
  try {
    const result = await pool.query(
      'UPDATE deliveries SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      ['In Progress', new Date(), deliveryId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error starting delivery:', error);
    throw error;
  }
}

async function assignDelivery(deliveryId, courierId) {
  try {
    const result = await pool.query(
      'UPDATE deliveries SET courier_id = $1, status = $2, updated_at = $3 WHERE id = $4 RETURNING *',
      [courierId, 'Assigned', new Date(), deliveryId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error assigning delivery:', error);
    throw error;
  }
}

async function verifyRecipient(deliveryId, recipientId, biometricMatched) {
  try {
    if (!biometricMatched) return null;

    await pool.query(
      'UPDATE deliveries SET status = $1, updated_at = $2 WHERE id = $3',
      ['Delivered', new Date(), deliveryId]
    );

    const podId = require('crypto').randomUUID();
    await pool.query(
      'INSERT INTO pods (id, delivery_id, recipient_id, verified, timestamp) VALUES ($1, $2, $3, $4, $5)',
      [podId, deliveryId, recipientId, true, new Date()]
    );

    return { proofRecorded: true };
  } catch (error) {
    console.error('Error verifying recipient:', error);
    throw error;
  }
}

async function getPodForDelivery(deliveryId) {
  try {
    const result = await pool.query(
      'SELECT * FROM pods WHERE delivery_id = $1',
      [deliveryId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting POD:', error);
    throw error;
  }
}

async function confirmDelivery(deliveryId) {
  try {
    const delivery = await getDeliveryById(deliveryId);
    if (!delivery) {
      return null;
    }

    if (delivery.status !== 'Delivered') {
      await pool.query(
        'UPDATE deliveries SET status = $1, updated_at = $2 WHERE id = $3',
        ['Delivered', new Date(), deliveryId]
      );
    }

    const pod = await getPodForDelivery(deliveryId);
    return pod || null;
  } catch (error) {
    console.error('Error confirming delivery:', error);
    throw error;
  }
}

module.exports = {
  addDelivery,
  assignDelivery,
  verifyRecipient,
  getPodForDelivery,
  getDeliveryById,
  getDeliveriesByCustomer,
  getDeliveriesByCourier,
  getDeliveryByTrackingNo,
  startDelivery,
  confirmDelivery
};
