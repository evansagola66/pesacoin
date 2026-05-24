const { ethers } = require('ethers');
require('dotenv').config();

// Minimal ABI for PesaCoin mint/burn
const ABI = [
    "function mint(address to, uint256 amount) public",
    "function burn(address from, uint256 amount) public",
    "function balanceOf(address account) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const treasuryWallet = new ethers.Wallet(process.env.TREASURY_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, treasuryWallet);

const mintPesaCoin = async (to, amount) => {
    console.log(`[Blockchain] Minting ${amount} PESA to ${to}...`);
    try {
        // Converting amount to 18 decimals
        const amountWei = ethers.parseUnits(amount.toString(), 18);
        const tx = await contract.mint(to, amountWei);
        console.log(`Mint TX Hash: ${tx.hash}`);
        return await tx.wait();
    } catch (error) {
        console.error('Blockchain Mint Error:', error);
        throw error;
    }
};

const burnPesaCoin = async (from, amount) => {
    console.log(`[Blockchain] Burning ${amount} PESA from ${from}...`);
    try {
        const amountWei = ethers.parseUnits(amount.toString(), 18);
        const tx = await contract.burn(from, amountWei);
        console.log(`Burn TX Hash: ${tx.hash}`);
        return await tx.wait();
    } catch (error) {
        console.error('Blockchain Burn Error:', error);
        throw error;
    }
};

module.exports = { mintPesaCoin, burnPesaCoin };
