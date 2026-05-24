const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '..', 'data');
const filePath = path.join(dataPath, 'users.json');

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}), 'utf8');
}

const loadRegistry = () => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw || '{}');
};

const saveRegistry = (registry) => {
  fs.writeFileSync(filePath, JSON.stringify(registry, null, 2), 'utf8');
};

const getWallet = (phoneNumber) => {
  const registry = loadRegistry();
  return registry[phoneNumber];
};

const registerUser = (phoneNumber, walletAddress) => {
  const registry = loadRegistry();
  registry[phoneNumber] = walletAddress;
  saveRegistry(registry);
  return registry[phoneNumber];
};

module.exports = { getWallet, registerUser };
