const express = require('express');
const bodyParser = require('body-parser');
const { lipaNaMpesaOnline, triggerMpesaB2C } = require('./utils/mpesa');
const { mintPesaCoin, burnPesaCoin } = require('./utils/blockchain');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Mock user registry
const userRegistry = {
    "254712345678": "0x1234567890123456789012345678901234567890"
};

/**
 * 1. DEPOSIT INITIATION (App calls this)
 */
app.post('/wallet/deposit', async (req, res) => {
    const { phoneNumber, amount } = req.body;
    try {
        const result = await lipaNaMpesaOnline(phoneNumber, amount);
        res.json({ status: 'success', mpesaResponse: result });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * 2. MPESA CALLBACK (Safaricom calls this)
 */
app.post('/mpesa/callback', async (req, res) => {
    const callbackData = req.body.Body.stkCallback;
    
    if (callbackData.ResultCode === 0) {
        const amount = callbackData.CallbackMetadata.Item.find(i => i.Name === 'Amount').Value;
        const phoneNumber = callbackData.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber').Value;
        
        console.log(`Confirmed: ${amount} KES from ${phoneNumber}`);
        
        const walletAddress = userRegistry[phoneNumber];
        if (walletAddress) {
            try {
                await mintPesaCoin(walletAddress, amount);
            } catch (err) {
                console.error("Blockchain mint failed after payment success", err);
            }
        }
    }
    
    res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
});

/**
 * 3. WITHDRAWAL FLOW (PesaCoin to M-Pesa)
 * The backend burns the user's stablecoin and sends KES to their M-Pesa.
 */
app.post('/wallet/withdraw', async (req, res) => {
    const { phoneNumber, amount, walletAddress } = req.body;
    
    try {
        // 1. Burn the tokens on the blockchain (Treasury handles gas)
        await burnPesaCoin(walletAddress, amount);
        
        // 2. Trigger M-Pesa B2C (Business to Customer)
        console.log(`Sending ${amount} KES to M-Pesa ${phoneNumber}`);
        const mpesaResult = await triggerMpesaB2C(phoneNumber, amount);
        
        res.json({ status: 'success', message: 'Withdrawal successful', mpesaResponse: mpesaResult });
    } catch (error) {
        console.error('Withdrawal Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`PesaCoin Gateway running on port ${PORT}`);
});
