const fetch = require('node-fetch');

async function loginPassword(email, password) {
  const res = await fetch('http://localhost:4000/api/v1/auth/login/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${await res.text()}`);
  }
  const data = await res.json();
  return data.token;
}

module.exports = { loginPassword };
