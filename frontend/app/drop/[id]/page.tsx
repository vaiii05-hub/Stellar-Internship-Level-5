"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { connectWallet, getWalletAddress } from "@/lib/stellar";
import {
  getGiftDropFromChain,
  getContributionsFromChain,
  contributeOnChain,
  fromStroops,
} from "@/lib/contract";

export default function DropPage() {
  const params = useParams();
  const dropId = typeof params?.id === "string" ? parseInt(params.id) : 0;

  const [gift, setGift] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [address, setAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [contributed, setContributed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [txHash, setTxHash] = useState<string>("");

  useEffect(() => {
    if (!dropId) return;
    const fetchData = async () => {
      try {
        const [giftData, contribs] = await Promise.all([
          getGiftDropFromChain(dropId),
          getContributionsFromChain(dropId),
        ]);
        setGift(giftData);
        setContributions(contribs);
      } catch (e) {
        console.error("Error fetching:", e);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
    getWalletAddress().then(setAddress);
  }, [dropId]);

  const handleContribute = async () => {
    setLoading(true);
    try {
      const addr = address || (await connectWallet());
      setAddress(addr);
      const amt = parseFloat(amount) || 0;
      const hash = await contributeOnChain(addr, dropId, amt);
      setTxHash(hash);
      setContributed(true);
      const [giftData, contribs] = await Promise.all([
        getGiftDropFromChain(dropId),
        getContributionsFromChain(dropId),
      ]);
      setGift(giftData);
      setContributions(contribs);
    } catch (error) {
      alert("Error contributing: " + error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fetching)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading gift drop... 🎁</div>
      </div>
    );

  if (!gift)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Gift drop not found 😕</div>
      </div>
    );

  const targetAmount = fromStroops(gift.target_amount);
  const currentAmount = fromStroops(gift.current_amount);
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const remaining = targetAmount - currentAmount;
  const isExpired = Date.now() > Number(gift.deadline) * 1000;
  const explorerBase = "https://stellar.expert/explorer/testnet/tx/";

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => window.history.back()}
          className="text-gray-400 text-sm mb-6 hover:text-white transition-colors flex items-center gap-2"
        >
          Back
        </button>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl">
              🎁
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Gift Drop #{dropId}
              </h1>
              <p className="text-gray-400 text-sm">{gift.occasion}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-400">
              Organiser:{" "}
              <span className="text-white font-mono">
                {gift.organiser
                  ? gift.organiser.slice(0, 8) + "..." + gift.organiser.slice(-4)
                  : "Unknown"}
              </span>
            </div>
            <div className="bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-400">
              Deadline:{" "}
              <span className="text-white">
                {new Date(Number(gift.deadline) * 1000).toLocaleDateString()}
              </span>
            </div>
            <div className="bg-green-500/20 text-green-400 rounded-lg px-3 py-1.5 text-xs font-semibold">
              {gift.is_released ? "COMPLETED" : isExpired ? "EXPIRED" : "ACTIVE"}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2">
              <span className="text-4xl font-bold text-cyan-400">
                {currentAmount.toFixed(2)}
              </span>
              <span className="text-gray-400 text-lg ml-2">
                XLM of {targetAmount.toFixed(2)} XLM
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: progress + "%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progress)}% reached</span>
              <span>{remaining > 0 ? remaining.toFixed(2) : 0} XLM remaining</span>
            </div>
          </div>

          {gift.message && (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Message</p>
              <p className="text-white text-sm italic">{gift.message}</p>
            </div>
          )}

          {!contributed && !isExpired && !gift.is_released && (
            <div className="mb-4">
              <p className="text-white font-semibold mb-3">
                Lock your contribution
              </p>
              <div className="flex gap-3 mb-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter XLM amount..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleContribute}
                  disabled={!amount || loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors"
                >
                  {loading ? "Processing..." : "Lock Funds 🔒"}
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                Funds are locked in Soroban smart contract on Stellar testnet.
              </p>
            </div>
          )}

          {contributed && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 mb-4">
              <p className="text-green-400 font-semibold mb-1">
                Funds locked successfully!
              </p>
              <p className="text-gray-400 text-sm mb-2">
                Your contribution is locked on-chain and verifiable on Stellar Explorer.
              </p>
              {txHash && (
                
                 <a href={explorerBase + txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 text-sm hover:text-purple-300 underline"
                >
                  View transaction on Stellar Explorer
                </a>
              )}
            </div>
          )}

          {!gift.is_released && (
            <div className="border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-red-400 font-semibold text-sm mb-1">
                Refund available after deadline
              </p>
              <p className="text-gray-500 text-xs">
                If the target is not reached, all contributors will be automatically refunded on{" "}
                {new Date(Number(gift.deadline) * 1000).toLocaleDateString()}{" "}
                if the goal is not reached.
              </p>
            </div>
          )}

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-1">
              Share this gift drop
            </p>
            <p className="text-gray-500 text-xs mb-3">
              Send this link to your friends
            </p>
            <div className="flex gap-3">
              <input
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-xs"
              />
              <button
                onClick={copyLink}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>

        {contributions.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Contributors</h2>
              <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                {contributions.length} people
              </span>
            </div>
            <div className="space-y-3">
              {contributions.map((c: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {c.contributor.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-mono">
                        {c.contributor.slice(0, 8)}...{c.contributor.slice(-4)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(Number(c.timestamp) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-white font-semibold">
                    {fromStroops(c.amount).toFixed(2)} XLM
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}