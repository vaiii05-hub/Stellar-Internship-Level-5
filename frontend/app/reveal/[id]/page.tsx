"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getGiftDropFromChain,
  getContributionsFromChain,
  fromStroops,
} from "@/lib/contract";

export default function RevealPage() {
  const params = useParams();
  const dropId = typeof params?.id === "string" ? parseInt(params.id) : 0;

  const [gift, setGift] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [fetching, setFetching] = useState(true);

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
        console.error("Error:", e);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [dropId]);

  useEffect(() => {
    if (!gift) return;
    const timer = setInterval(() => {
      const now = Date.now();
      const reveal = Number(gift.reveal_date) * 1000;
      const diff = reveal - now;
      if (diff <= 0) {
        setIsRevealed(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gift]);

  if (fetching)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading... 🎁</div>
      </div>
    );

  if (!gift)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 text-lg">Gift drop not found</div>
      </div>
    );

  const currentAmount = fromStroops(gift.current_amount);
  const targetAmount = fromStroops(gift.target_amount);
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {!isRevealed ? (
          <>
            <div className="text-6xl mb-6">🎁</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Something special is coming...
            </h1>
            <p className="text-gray-400 mb-12">
              A surprise gift reveals in
            </p>

            {timeLeft && (
              <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-4"
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6">
              <p className="text-gray-400 text-sm mb-1">Funded so far</p>
              <p className="text-3xl font-bold text-white">
                {currentAmount.toFixed(2)} / {targetAmount.toFixed(2)} XLM
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
                <div
                  className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                  style={{ width: progress + "%" }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-4">
              Surprise!
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              Your friends pooled together just for you!
            </p>

            <div className="bg-gradient-to-r from-pink-900/30 to-orange-900/30 border border-pink-500/30 rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-white mb-2">
                {currentAmount.toFixed(2)} XLM
              </div>
              <div className="text-gray-400">
                from {contributions.length} amazing friends
              </div>
            </div>

            {gift.message && (
              <div className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6 mb-8">
                <p className="text-gray-400 text-sm mb-3">A message for you</p>
                <p className="text-white text-lg italic">{gift.message}</p>
              </div>
            )}

            {contributions.length > 0 && (
              <div className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-6 mb-8">
                <p className="text-gray-400 text-sm mb-4">Your amazing contributors</p>
                <div className="space-y-3">
                  {contributions.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">
                        {c.contributor.slice(0, 6)}...{c.contributor.slice(-4)}
                      </span>
                      <span className="text-pink-400 font-semibold">
                        {fromStroops(c.amount).toFixed(2)} XLM
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/"
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Create Your Own Gift Drop 🎁
            </Link>
          </>
        )}
      </div>
    </div>
  );
}