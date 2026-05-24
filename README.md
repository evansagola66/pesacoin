# PesaCoin

A stablecoin pegged 1:1 to the Kenyan Shilling (KES) with integrated M-Pesa on/off ramps and zero-cost transfers.

## Features
- **1 PesaCoin = 1 KES**: Fully backed stablecoin.
- **M-Pesa Integration**: Deposit KES via STK Push and withdraw via B2C.
- **Zero Cost**: 
    - No transaction fees for sending/receiving between PesaCoin wallets.
    - Gas fees are handled by the Treasury using Meta-Transactions (Relayers).

## Getting Started

### 1. Configuration
Update `.env` with your sandbox credentials and blockchain details.

### 2. Deployment
Deploy the smart contract to a testnet (e.g., Polygon Amoy):
```bash
node deploy.js
```
Copy the resulting address into `CONTRACT_ADDRESS` in `.env`.

### 3. Start the Backend
```bash
node server.js
```

### 4. Zero-Cost Gasless Flow (Theory)
To make transfers zero-cost for users:
1. **User signs** a transfer message (EIP-712) in the mobile app. They don't need native GAS tokens (like MATIC).
2. **App sends signature** to your backend `/wallet/transfer`.
3. **Backend (Relayer)** submits the transaction to the blockchain and pays the gas from the Treasury.

Example implementation using Biconomy or OpenZeppelin Defender:
- The `PesaCoin.sol` should inherit `ERC20Permit`.
- Use a `forwarder` contract to process signed messages.

## API Endpoints
- `POST /wallet/deposit`: Initiates M-Pesa STK Push.
- `POST /mpesa/callback`: Confirms payment and mints PesaCoin.
- `POST /wallet/withdraw`: Burns PesaCoin and triggers M-Pesa B2C.
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
