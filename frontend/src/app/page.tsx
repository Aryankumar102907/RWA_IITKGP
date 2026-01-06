'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance
} from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import {
  MOCK_USDC_ADDRESS,
  BOND_VAULT_ADDRESS,
  MockUSDCABI,
  BondVaultABI
} from '../constants/contracts';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [yieldAmount, setYieldAmount] = useState('');

  // USDC Balance
  const { data: usdcBalanceData, refetch: refetchUSDC } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Vault Share Balance
  const { data: shareBalanceData, refetch: refetchShares } = useReadContract({
    address: BOND_VAULT_ADDRESS,
    abi: BondVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Share Price / Asset Value (convertToAssets)
  const { data: portfolioValueData, refetch: refetchValue } = useReadContract({
    address: BOND_VAULT_ADDRESS,
    abi: BondVaultABI,
    functionName: 'convertToAssets',
    args: shareBalanceData ? [shareBalanceData] : undefined,
  });

  // Vault Allowance for USDC
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: MOCK_USDC_ADDRESS,
    abi: MockUSDCABI,
    functionName: 'allowance',
    args: address ? [address, BOND_VAULT_ADDRESS] : undefined,
  });

  // Contract Writes
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      refetchUSDC();
      refetchShares();
      refetchValue();
      refetchAllowance();
    }
  }, [isConfirmed]);

  const handleMintUSDC = () => {
    writeContract({
      address: MOCK_USDC_ADDRESS,
      abi: MockUSDCABI,
      functionName: 'mint',
      args: [address!, parseUnits('1000', 6)],
    });
  };

  const handleInvest = async () => {
    if (!amount) return;
    const parsedAmount = parseUnits(amount, 6);

    if ((allowanceData as bigint || 0n) < parsedAmount) {
      writeContract({
        address: MOCK_USDC_ADDRESS,
        abi: MockUSDCABI,
        functionName: 'approve',
        args: [BOND_VAULT_ADDRESS, parsedAmount],
      });
    } else {
      writeContract({
        address: BOND_VAULT_ADDRESS,
        abi: BondVaultABI,
        functionName: 'deposit',
        args: [parsedAmount, address!],
      });
    }
  };

  const handleWithdraw = () => {
    if (!shareBalanceData) return;
    writeContract({
      address: BOND_VAULT_ADDRESS,
      abi: BondVaultABI,
      functionName: 'redeem',
      args: [shareBalanceData, address!, address!],
    });
  };

  const handleDistributeYield = () => {
    if (!yieldAmount) return;
    const parsedAmount = parseUnits(yieldAmount, 6);

    if ((allowanceData as bigint || 0n) < parsedAmount) {
      writeContract({
        address: MOCK_USDC_ADDRESS,
        abi: MockUSDCABI,
        functionName: 'approve',
        args: [BOND_VAULT_ADDRESS, parsedAmount],
      });
    } else {
      writeContract({
        address: BOND_VAULT_ADDRESS,
        abi: BondVaultABI,
        functionName: 'distributeYield',
        args: [parsedAmount],
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Fractional RWA Bonds
          </h1>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Secure, transparent, and high-yield government bonds tokenized on-chain.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Treasury Dashboard</h1>
          <p className="text-slate-400">Institutional-grade RWA access</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400"
          >
            <Settings className="w-5 h-5" />
          </button>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="USDC Balance"
          value={usdcBalanceData ? `${formatUnits(usdcBalanceData as bigint, 6)} USDC` : '0.00 USDC'}
          icon={<Coins className="w-5 h-5 text-blue-400" />}
          action={
            <button
              onClick={handleMintUSDC}
              className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Mint Test USDC
            </button>
          }
        />
        <StatCard
          label="Bond Shares"
          value={shareBalanceData ? `${formatUnits(shareBalanceData as bigint, 18)} fBOND` : '0.00 fBOND'}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Portfolio Value"
          value={portfolioValueData ? `$${formatUnits(portfolioValueData as bigint, 6)}` : '$0.00'}
          icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
          highlight
        />
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invest Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-emerald-400" /> Invest in Bonds
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">Amount to Invest (USDC)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              />
            </div>
            <button
              onClick={handleInvest}
              disabled={isConfirming || !amount}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              {isConfirming ? 'Processing...' : (allowanceData as bigint || 0n) < parseUnits(amount || '0', 6) ? 'Approve USDC' : 'Deposit USDC'}
            </button>
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-blue-400" /> Redeem Portfolio
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 text-center">
              <p className="text-sm text-slate-400 mb-1">Total Available to Withdraw</p>
              <p className="text-2xl font-bold font-mono text-blue-400">
                {portfolioValueData ? `${formatUnits(portfolioValueData as bigint, 6)} USDC` : '0.00 USDC'}
              </p>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isConfirming || !shareBalanceData || (shareBalanceData as bigint) === 0n}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              Withdraw All
            </button>
          </div>
        </div>
      </div>

      {/* Admin Panel (Hidden by default) */}
      {isAdmin && (
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-amber-500">
            <Settings className="w-5 h-5" /> Admin: Yield Simulation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-500/70 ml-1">Yield Amount to Distribute (USDC)</label>
              <input
                type="number"
                value={yieldAmount}
                onChange={(e) => setYieldAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-amber-900/20 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono text-amber-50"
              />
            </div>
            <button
              onClick={handleDistributeYield}
              disabled={isConfirming || !yieldAmount}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              {isConfirming ? 'Processing...' : (allowanceData as bigint || 0n) < parseUnits(yieldAmount || '0', 6) ? 'Approve Yield (USDC)' : 'Distribute Yield'}
            </button>
          </div>
          <p className="mt-4 text-xs text-amber-500/50 italic">
            * This simulates real-world interest payment. It will increase the value for all fBOND holders.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false, action = null }: {
  label: string,
  value: string,
  icon: React.ReactNode,
  highlight?: boolean,
  action?: React.ReactNode
}) {
  return (
    <div className={`bg-slate-900/50 border ${highlight ? 'border-purple-500/30' : 'border-slate-800'} rounded-3xl p-6 backdrop-blur-sm shadow-xl transition-all hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
      {action}
    </div>
  );
}
