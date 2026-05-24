const { cleanEnv, str, num } = require('envalid');

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: num({ default: 3000 }),
  MPESA_CONSUMER_KEY: str(),
  MPESA_CONSUMER_SECRET: str(),
  MPESA_SHORTCODE: str(),
  MPESA_PASSKEY: str(),
  MPESA_CALLBACK_URL: str(),
  MPESA_SECURITY_CREDENTIAL: str(),
  BLOCKCHAIN_RPC_URL: str(),
  TREASURY_PRIVATE_KEY: str(),
  CONTRACT_ADDRESS: str(),
  FRONTEND_URL: str({ default: 'http://localhost:5173' }),
  LOG_LEVEL: str({ default: 'info' }),
});

module.exports = env;
