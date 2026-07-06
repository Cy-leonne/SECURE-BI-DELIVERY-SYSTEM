const fetch = require('node-fetch');
const { Pool } = require('pg');
const { loginPassword } = require('./test-utils');

(async () => {
  const base = 'http://localhost:4000/api/v1';
  const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'securebi', password: '336710', port: 5432 });
  try {
    const { rows } = await pool.query('SELECT id FROM deliveries LIMIT 1');
    const deliveryId = rows[0]?.id;
    if (!deliveryId) {
      console.error('No delivery found');
      process.exit(1);
    }

    console.log('Delivery ID:', deliveryId);
    const token = await loginPassword('courier@gmail.com', 'password123');
    console.log('Token:', token.slice(0, 30), '...');

    const stkRes = await fetch(`${base}/payments/stk-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deliveryId, phone: '254712345678' })
    });
    console.log('STK Push status', stkRes.status, await stkRes.text());

    const payRes = await fetch(`${base}/payments/paybill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ deliveryId, phone: '254712345678', amount: 1500 })
    });
    console.log('Paybill status', payRes.status, await payRes.text());
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
})();
