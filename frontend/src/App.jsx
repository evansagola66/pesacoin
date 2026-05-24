import React, { useState } from 'react';
import axios from 'axios';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Send, ShieldCheck, Coins } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
  const [registerWalletAddress, setRegisterWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/user/register`, {
        phoneNumber: registerPhoneNumber,
        walletAddress: registerWalletAddress,
      });
      setMessage({ type: 'success', text: 'Wallet registered successfully.' });
      setRegisterPhoneNumber('');
      setRegisterWalletAddress('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    }
    setLoading(false);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/wallet/deposit`, { phoneNumber, amount });
      setMessage({ type: 'success', text: 'STK Push sent! Please enter your PIN on your phone.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Deposit failed' });
    }
    setLoading(false);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/wallet/withdraw`, { phoneNumber, amount, walletAddress });
      setMessage({ type: 'success', text: 'Withdrawal successful! Check your M-Pesa.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Withdrawal failed' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coins size={32} />
            <h1 className="text-2xl font-bold tracking-tight">PesaCoin</h1>
          </div>
          <div className="bg-emerald-700 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
            <ShieldCheck size={18} />
            Treasury Backed 1:1 KES
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Status Message */}
        {message.text && (
          <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Wallet size={24} />
            </div>
            <h2 className="text-xl font-bold">Register Wallet</h2>
          </div>
          <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="254712345678"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={registerPhoneNumber}
                onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Wallet Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all"
                value={registerWalletAddress}
                onChange={(e) => setRegisterWalletAddress(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Wallet'}
              </button>
            </div>
          </form>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Deposit Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <ArrowDownCircle size={24} />
              </div>
              <h2 className="text-xl font-bold">Deposit KES</h2>
            </div>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="254712345678" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Amount (KES)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : 'Deposit via M-Pesa'}
              </button>
            </form>
          </section>

          {/* Withdrawal Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <ArrowUpCircle size={24} />
              </div>
              <h2 className="text-xl font-bold">Withdraw to KES</h2>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">PesaCoin Wallet Address</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Amount to Burn</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Recipient Phone (M-Pesa)</label>
                <input 
                  type="text" 
                  placeholder="254712345678" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Withdraw to M-Pesa'}
              </button>
            </form>
          </section>
        </div>

        {/* Transfer Section (Placeholder for Zero Cost) */}
        <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Send size={24} className="text-emerald-400" />
                <h2 className="text-2xl font-bold">Zero-Cost Transfers</h2>
              </div>
              <p className="text-slate-400 max-w-md">
                Send PesaCoin to any wallet address instantly with zero transaction fees. No KES, no gas, just pure value.
              </p>
            </div>
            <button className="bg-white text-slate-900 font-bold py-4 px-8 rounded-xl hover:bg-slate-100 transition-colors">
              Coming Soon: Gasless Sending
            </button>
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto p-6 text-center text-slate-500 text-sm">
        &copy; 2026 PesaCoin Stablecoin. All rights reserved. Powered by M-Pesa Daraja & Ethereum.
      </footer>
    </div>
  );
}

export default App;
