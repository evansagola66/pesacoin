require('dotenv').config();
require('express-async-errors');

const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./utils/config');
const { lipaNaMpesaOnline, triggerMpesaB2C } = require('./utils/mpesa');
const { mintPesaCoin, burnPesaCoin } = require('./utils/blockchain');
const { getWallet, registerUser } = require('./utils/userRegistry');

const app = express();
app.enable('trust proxy');
app.use(helmet());
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const PORT = config.PORT;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/wallet/deposit', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ status: 'error', message: 'phoneNumber and amount are required' });
  }

  const walletAddress = getWallet(phoneNumber);
  if (!walletAddress) {
    return res.status(404).json({ status: 'error', message: 'Phone number is not registered. Please register a wallet address first.' });
  }

  try {
    const result = await lipaNaMpesaOnline(phoneNumber, amount);
    res.json({ status: 'success', mpesaResponse: result });
  } catch (error) {
    console.error('Deposit Error:', error?.response?.data || error.message || error);
    res.status(500).json({ status: 'error', message: 'Unable to initiate deposit' });
  }
});

app.post('/api/user/register', (req, res) => {
  const { phoneNumber, walletAddress } = req.body;

  if (!phoneNumber || !walletAddress) {
    return res.status(400).json({ status: 'error', message: 'phoneNumber and walletAddress are required' });
  }

  const saved = registerUser(phoneNumber, walletAddress);
  res.json({ status: 'success', phoneNumber, walletAddress: saved });
});

app.get('/api/user/:phoneNumber', (req, res) => {
  const walletAddress = getWallet(req.params.phoneNumber);
  if (!walletAddress) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }
  res.json({ status: 'success', walletAddress });
});

const handleMpesaCallback = async (req, res) => {
  const callbackData = req.body?.Body?.stkCallback;

  if (!callbackData) {
    return res.status(400).json({ status: 'error', message: 'Invalid callback payload' });
  }

  if (callbackData.ResultCode === 0) {
    const amount = callbackData.CallbackMetadata.Item.find(i => i.Name === 'Amount')?.Value;
    const phoneNumber = callbackData.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber')?.Value;

    console.log(`Confirmed: ${amount} KES from ${phoneNumber}`);

    const walletAddress = getWallet(phoneNumber);
    if (walletAddress) {
      try {
        await mintPesaCoin(walletAddress, amount);
      } catch (err) {
        console.error('Blockchain mint failed after payment success', err);
      }
    } else {
      console.warn(`No wallet registered for phone number ${phoneNumber}`);
    }
  }

  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
};

app.post('/api/mpesa/callback', handleMpesaCallback);
app.post('/mpesa/callback', handleMpesaCallback);

app.post('/api/wallet/withdraw', async (req, res) => {
  const { phoneNumber, amount, walletAddress } = req.body;

  if (!phoneNumber || !amount || !walletAddress) {
    return res.status(400).json({ status: 'error', message: 'phoneNumber, amount and walletAddress are required' });
  }

  try {
    await burnPesaCoin(walletAddress, amount);
    console.log(`Sending ${amount} KES to M-Pesa ${phoneNumber}`);

    const mpesaResult = await triggerMpesaB2C(phoneNumber, amount);
    res.json({ status: 'success', message: 'Withdrawal successful', mpesaResponse: mpesaResult });
  } catch (error) {
    console.error('Withdrawal Error:', error?.response?.data || error.message || error);
    res.status(500).json({ status: 'error', message: 'Unable to process withdrawal' });
  }
});

const frontendDist = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({ status: 'error', message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`PesaCoin Gateway running on port ${PORT}`);
});
