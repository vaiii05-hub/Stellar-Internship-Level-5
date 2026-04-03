"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getWalletAddress, connectWallet, shortenAddress } from "@/lib/stellar";
import {
  getOrganiserDrops,
  getContributorDrops,
  getGiftDropFromChain,
  fromStroops,
} from "@/lib/contract";

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [myDrops, setMyDrops] = useState<any[]>([]);
  const [myContributions, setMyContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"drops" | "contributions">("drops");

  useEffect(() => {
    getWalletAddress().then((addr) => {
      setAddress(addr);
      if (addr) loadData(addr);
      else setLoading(false);
    });
  }, []);

  const loadData = async (addr: string) => {
    try {
      const [organiserIds, contributorIds] = await Promise.all([
        getOrganiserDrops(addr),
        getContributorDrops(addr),
      ]);

      const drops = await Promise.all(
        organiserIds.map(async (id) => {
          const drop = await getGiftDropFromChain(id);
          return { ...drop, dropId: id };
        })
      );
      setMyDrops(drops);

     const contributions = (await Promise.all(
  contributorIds.map(async (id) => {
    const drop = await getGiftDropFromChain(id);
    if (!drop) return null;
    return { ...drop, dropId: id };
  })
)).filter(Boolean);
setMyContributions(contributions);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    const addr = await connectWallet();
    setAddress(addr);
    loadData(addr);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading... 🎁</div>
      </div>
    );

  if (!address)
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-3xl font-bold text-white mb-4">Connect your wallet</h1>
        <p className="text-gray-400 mb-8">Connect to see your gift drops</p>
        <button
          onClick={handleConnect}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Gift Drops 🎁</h1>
            <p className="text-gray-400 text-sm">{shortenAddress(address)}</p>
          </div>
          <Link
            href="/create"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            + New Drop
          </Link>
        </div>

        <div className="flex gap-2 mb-8 bg-gray-900 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("drops")}
            className={"px-6 py-2 rounded-lg text-sm font-semibold transition-colors " +
              (activeTab === "drops"
                ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                : "text-gray-400 hover:text-white")}
          >
            My Drops ({myDrops.length})
          </button>
          <button
            onClick={() => setActiveTab("contributions")}
            className={"px-6 py-2 rounded-lg text-sm font-semibold transition-colors " +
              (activeTab === "contributions"
                ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                : "text-gray-400 hover:text-white")}
          >
            My Contributions ({myContributions.length})
          </button>
        </div>

        {activeTab === "drops" && (
          <>
            {myDrops.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🎁</div>
                <h2 className="text-2xl font-bold text-white mb-4">No gift drops yet</h2>
                <p className="text-gray-400 mb-8">Create your first gift drop!</p>
                <Link
                  href="/create"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Create a Gift Drop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myDrops.map((gift) => {
                  const targetAmount = fromStroops(gift.target_amount);
                  const currentAmount = fromStroops(gift.current_amount);
                  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
                  const isExpired = Date.now() > Number(gift.deadline) * 1000;
                  return (
                    <div key={gift.dropId} className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-pink-500/20 border border-pink-500/30 text-pink-400 px-3 py-1 rounded-full text-xs">
                          {gift.occasion}
                        </span>
                        <span className={"text-xs px-3 py-1 rounded-full " +
                          (gift.is_released ? "bg-green-500/20 text-green-400"
                            : isExpired ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400")}>
                          {gift.is_released ? "✓ Released" : isExpired ? "⚠ Expired" : "● Active"}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Drop #{gift.dropId}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Reveal: {new Date(Number(gift.reveal_date) * 1000).toLocaleDateString()}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">{currentAmount.toFixed(2)} XLM raised</span>
                          <span className="text-pink-400 font-bold">{Math.round(progress)}% funded</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all"
                            style={{ width: progress + "%" }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">On-chain</span>
                        <div className="flex gap-3">
                          <Link href={"/drop/" + gift.dropId} className="text-pink-400 text-sm hover:text-pink-300 transition-colors">
                            View Drop
                          </Link>
                          <Link href={"/reveal/" + gift.dropId} className="text-orange-400 text-sm hover:text-orange-300 transition-colors">
                            Reveal
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "contributions" && (
          <>
            {myContributions.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">💝</div>
                <h2 className="text-2xl font-bold text-white mb-4">No contributions yet</h2>
                <p className="text-gray-400">You have not contributed to any gift drops yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myContributions.map((gift) => {
                  const targetAmount = fromStroops(gift.target_amount);
                  const currentAmount = fromStroops(gift.current_amount);
                  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
                  return (
                    <div key={gift.dropId} className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 px-3 py-1 rounded-full text-xs">
                          {gift.occasion}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
                          Contributed
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        Drop #{gift.dropId}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {currentAmount.toFixed(2)} / {targetAmount.toFixed(2)} XLM
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">{currentAmount.toFixed(2)} XLM raised</span>
                          <span className="text-purple-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: progress + "%" }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">On-chain</span>
                        <Link href={"/drop/" + gift.dropId} className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
                          View Drop
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
