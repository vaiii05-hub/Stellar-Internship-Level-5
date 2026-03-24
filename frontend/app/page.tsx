"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { connectWallet, getWalletAddress } from "@/lib/stellar";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    getWalletAddress().then(setAddress);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-orange-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Surprise someone</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              they'll never forget
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Friends secretly pool money for someone's gift. Everyone locks
            their share on-chain. Reveals automatically on the special day. 🎉
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              🎁 Create a Gift Drop
            </Link>
            <Link
              href="/dashboard"
              className="border border-pink-500/50 text-pink-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-500/10 transition-colors"
            >
              View My Drops
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">100%</div>
            <div className="text-gray-500 text-sm mt-1">On-chain secured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">Auto</div>
            <div className="text-gray-500 text-sm mt-1">Release on reveal</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">Zero</div>
            <div className="text-gray-500 text-sm mt-1">Trust needed</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Simple as 1, 2, 3 🎊
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              icon: "✨",
              title: "Create a Gift Drop",
              desc: "Set occasion, target amount, recipient wallet and reveal date.",
            },
            {
              step: "02",
              icon: "🔒",
              title: "Friends chip in",
              desc: "Share the link. Everyone locks their XLM into the smart contract.",
            },
            {
              step: "03",
              icon: "🎉",
              title: "Surprise reveal",
              desc: "On reveal date, funds auto-release to recipient's wallet.",
            },
            {
              step: "04",
              icon: "💸",
              title: "Auto refund",
              desc: "Goal not reached by deadline? Everyone gets their money back.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-colors"
            >
              <div className="text-gray-700 text-4xl font-bold mb-4">
                {item.step}
              </div>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Perfect for every occasion 🥳
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "🎂 Birthday",
            "👋 Farewell",
            "💍 Wedding",
            "🎓 Graduation",
            "🏆 Achievement",
            "❤️ Anniversary",
            "🎄 Christmas",
            "🎊 Any Occasion",
          ].map((occasion) => (
            <span
              key={occasion}
              className="bg-gray-900/50 border border-pink-500/20 text-gray-300 px-6 py-3 rounded-full text-sm hover:border-pink-500/60 hover:text-pink-400 transition-colors cursor-pointer"
            >
              {occasion}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-pink-900/30 to-orange-900/30 border border-pink-500/20 rounded-3xl p-12">
          <div className="text-5xl mb-6">🎁</div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to surprise someone?
          </h2>
          <p className="text-gray-400 mb-8">
            Create your first gift drop in 30 seconds. Share with friends. Done.
          </p>
          <Link
            href="/create"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Create a Gift Drop →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>GiftDrop 🎁 — Built on Stellar Testnet</p>
      </footer>
    </div>
  );
}