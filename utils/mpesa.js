const axios = require('axios');
const { DateTime } = require('luxon');
const config = require('./config');

const getMpesaToken = async () => {
  const auth = Buffer.from(`${config.MPESA_CONSUMER_KEY}:${config.MPESA_CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching M-Pesa token:', error.response?.data || error.message);
    throw error;
  }
};

const lipaNaMpesaOnline = async (phoneNumber, amount) => {
  const token = await getMpesaToken();
  const timestamp = DateTime.now().setZone('Africa/Nairobi').toFormat('yyyyMMddHHmmss');
  const password = Buffer.from(`${config.MPESA_SHORTCODE}${config.MPESA_PASSKEY}${timestamp}`).toString('base64');

  const data = {
    BusinessShortCode: config.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: config.MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: config.MPESA_CALLBACK_URL,
    AccountReference: 'PesaCoinDeposit',
    TransactionDesc: 'Deposit to PesaCoin Wallet'
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    throw error;
  }
};

const triggerMpesaB2C = async (phoneNumber, amount) => {
  const token = await getMpesaToken();

  const data = {
    InitiatorName: 'testapi',
    SecurityCredential: config.MPESA_SECURITY_CREDENTIAL,
    CommandID: 'BusinessPayment',
    Amount: amount,
    PartyA: config.MPESA_SHORTCODE,
    PartyB: phoneNumber,
    Remarks: 'PesaCoin Withdrawal',
    QueueTimeOutURL: config.MPESA_CALLBACK_URL,
    ResultURL: config.MPESA_CALLBACK_URL,
    Occasion: 'Withdrawal'
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('B2C Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { lipaNaMpesaOnline, triggerMpesaB2C };
