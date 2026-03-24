"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, getWalletAddress, shortenAddress } from "@/lib/stellar";

export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getWalletAddress().then(setAddress);
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (error) {
      alert("Please install Freighter wallet extension");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setShowMenu(false);
    // Clear localStorage bins
    localStorage.removeItem("giftdrop-bins");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-pink-500/20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            GiftDrop
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">
            Home
          </Link>
          <Link href="/create" className="text-gray-300 hover:text-pink-400 transition-colors">
            Create
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-pink-400 transition-colors">
            Dashboard
          </Link>
        </div>

        {/* Wallet Button */}
        {address ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {shortenAddress(address)}
              <span className="text-xs">{showMenu ? "▲" : "▼"}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-gray-400 text-xs">Connected wallet</p>
                  <p className="text-white text-xs font-mono mt-1">
                    {shortenAddress(address)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                >
                  Copy Address
                </button>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-3 text-gray-300 text-sm hover:bg-gray-800 transition-colors"
                >
                  My Drops
                </Link>
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-gray-800 transition-colors border-t border-gray-700"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}