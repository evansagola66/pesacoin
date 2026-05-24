# PesaCoin

A production-ready stablecoin gateway for Kenyan Shilling (KES) on/off ramps with M-Pesa and Ethereum integration.

## What’s included
- Backend API with M-Pesa STK Push and B2C payout support
- Ethereum contract deployment and treasury-based mint/burn flows
- React + Vite frontend with dev proxy support
- Production build flow and Docker deployment support

## Environment
Copy `.env.example` to `.env` and fill the values.

Required variables:
- `NODE_ENV` — `development` or `production`
- `PORT` — backend port
- `FRONTEND_URL` — frontend origin for CORS
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `MPESA_SECURITY_CREDENTIAL`
- `BLOCKCHAIN_RPC_URL`
- `TREASURY_PRIVATE_KEY`
- `CONTRACT_ADDRESS`
- `LOG_LEVEL`

## Local development

Install dependencies for backend and frontend:
```bash
cd pesacoin
npm install
npm run frontend:install
```

Start the frontend and backend together:
```bash
npm run dev
```

Open the frontend at:
```bash
http://localhost:5173
```

## Build for production

Build the frontend assets:
```bash
npm run build
```

Start the backend and serve the frontend from `frontend/dist`:
```bash
npm run start:prod
```

The app will be available at `http://localhost:3000`.

## Docker deployment

Build the container:
```bash
docker build -t pesacoin .
```

Run the container with environment variables:
```bash
docker run -p 3000:3000 --env-file .env pesacoin
```

## Smart contract deployment

Compile and deploy the contract using:
```bash
node deploy.js
```

Then update `CONTRACT_ADDRESS` in `.env`.

## API endpoints
- `POST /api/user/register` — register a phone number with a wallet address
- `GET /api/user/:phoneNumber` — lookup a registered wallet address
- `POST /api/wallet/deposit` — initiate STK Push deposit
- `POST /api/mpesa/callback` — receive M-Pesa callback and mint tokens
- `POST /mpesa/callback` — alias for M-Pesa callback compatibility
- `POST /api/wallet/withdraw` — burn tokens and send KES via M-Pesa B2C
- `GET /api/health` — service health check

## Notes
- Register the user's phone and wallet address before deposit to enable minting on callback.
- Add `phoneNumber`/`walletAddress` data to `data/users.json` or use `/api/user/register`.

## Notes for production hardening
- Use a secure M-Pesa callback URL with HTTPS
- Protect secret keys and do not commit `.env`
- Add stricter validation for request payloads and user identity
- Replace placeholder `SecurityCredential` with a real encrypted value for B2C
- Consider a proper user registry or wallet onboarding system
- Add logging/monitoring and error alerting for payment and blockchain failures
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
