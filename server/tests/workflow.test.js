import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../app.js';

let server;
let baseUrl;

async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${baseUrl}/api${path}`, { method, headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const data = response.status === 204 ? null : await response.json();
  assert.ok(response.ok, `${method} ${path} failed: ${data?.message || response.status}`);
  return data;
}

before(async () => {
  process.env.JWT_SECRET = 'integration-test-secret';
  await mongoose.connect('mongodb://127.0.0.1:27017/contract-farming-system-test');
  await mongoose.connection.dropDatabase();
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', () => { baseUrl = `http://127.0.0.1:${server.address().port}`; resolve(); }); });
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await new Promise(resolve => server.close(resolve));
});

test('farmer and company can complete the contract application workflow', async () => {
  const company = await request('/auth/register', { method: 'POST', body: { name: 'Test Buyer', companyName: 'Test Buyer', email: 'buyer@test.local', password: 'Password123', role: 'COMPANY' } });
  const farmer = await request('/auth/register', { method: 'POST', body: { name: 'Test Farmer', email: 'farmer@test.local', password: 'Password123', role: 'FARMER' } });
  const farm = await request('/farms', { method: 'POST', token: farmer.token, body: { name: 'Test Farm', location: { address: 'Test Village', district: 'Nashik' }, landArea: 2, landUnit: 'Acres' } });
  const contract = await request('/contracts', { method: 'POST', token: company.token, body: { crop: 'Tomato', requiredQuantity: 20, unit: 'Quintal', pricePerUnit: 1800, status: 'OPEN' } });
  const application = await request('/applications', { method: 'POST', token: farmer.token, body: { contract: contract._id, farm: farm._id, appliedQuantity: 15 } });
  const decision = await request(`/applications/${application._id}/decision`, { method: 'PATCH', token: company.token, body: { status: 'ACCEPTED' } });
  assert.equal(decision.status, 'ACCEPTED');
  const farmerDashboard = await request('/dashboard', { token: farmer.token });
  assert.equal(farmerDashboard.activeContracts, 1);
});

test('public registration cannot create privileged roles', async () => {
  const account = await request('/auth/register', { method: 'POST', body: { name: 'No Admin', email: 'no-admin@test.local', password: 'Password123', role: 'ADMIN' } });
  assert.equal(account.user.role, 'FARMER');
});
