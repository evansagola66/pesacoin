const axios = require('axios');
const { DateTime } = require('luxon');
require('dotenv').config();

const getMpesaToken = async () => {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

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
    const password = Buffer.from(
        process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    const data = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "PesaCoinDeposit",
        TransactionDesc: "Deposit to PesaCoin Wallet"
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
        InitiatorName: "testapi",
        SecurityCredential: "ENC_PW_HERE",
        CommandID: "BusinessPayment",
        Amount: amount,
        PartyA: process.env.MPESA_SHORTCODE,
        PartyB: phoneNumber,
        Remarks: "PesaCoin Withdrawal",
        QueueTimeOutURL: process.env.MPESA_CALLBACK_URL,
        ResultURL: process.env.MPESA_CALLBACK_URL,
        Occasion: "Withdrawal"
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
