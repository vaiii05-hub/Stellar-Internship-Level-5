"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { connectWallet, getWalletAddress, dateToTimestamp } from "@/lib/stellar";
import { createGiftDropOnChain } from "@/lib/contract";

const OCCASIONS = [
  "🎂 Birthday",
  "👋 Farewell",
  "💍 Wedding",
  "🎓 Graduation",
  "🏆 Achievement",
  "❤️ Anniversary",
  "🎄 Christmas",
  "🎊 Any Occasion",
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    occasion: "",
    recipientName: "",
    recipientWallet: "",
    targetAmount: "",
    deadline: "",
    revealDate: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const address = await getWalletAddress() || await connectWallet();
      const dropId = await createGiftDropOnChain(
        address,
        form.recipientWallet,
        parseFloat(form.targetAmount),
        dateToTimestamp(form.deadline),
        dateToTimestamp(form.revealDate),
        form.occasion,
        form.message
      );
      router.push("/drop/" + dropId);
    } catch (error) {
      alert("Error creating gift drop: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Create a Gift Drop
          </h1>
          <p className="text-gray-400">
            Set it up in 30 seconds. Share the link. Watch the magic happen.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors " +
                  (step >= s
                    ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                    : "bg-gray-800 text-gray-500")
                }
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={
                    "w-16 h-0.5 " +
                    (step > s ? "bg-pink-500" : "bg-gray-800")
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-900/50 border border-pink-500/20 rounded-2xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                What is the occasion? 🎊
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {OCCASIONS.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => setForm({ ...form, occasion })}
                    className={
                      "p-3 rounded-xl border text-sm font-medium transition-colors " +
                      (form.occasion === occasion
                        ? "border-pink-500 bg-pink-500/20 text-pink-400"
                        : "border-gray-700 text-gray-400 hover:border-pink-500/50")
                    }
                  >
                    {occasion}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!form.occasion}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Who is the lucky one? 🥳
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Recipient Name
                  </label>
                  <input
                    name="recipientName"
                    value={form.recipientName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Recipient Stellar Wallet Address
                  </label>
                  <input
                    name="recipientWallet"
                    value={form.recipientWallet}
                    onChange={handleChange}
                    placeholder="G..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Personal Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write a sweet message for the recipient..."
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-700 text-gray-400 py-3 rounded-xl font-semibold hover:border-pink-500/50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.recipientName || !form.recipientWallet}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Set the goal and dates 🎯
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Target Amount (XLM)
                  </label>
                  <input
                    name="targetAmount"
                    type="number"
                    value={form.targetAmount}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Contribution Deadline
                  </label>
                  <input
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Reveal Date
                  </label>
                  <input
                    name="revealDate"
                    type="date"
                    value={form.revealDate}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-700 text-gray-400 py-3 rounded-xl font-semibold hover:border-pink-500/50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !form.targetAmount ||
                    !form.deadline ||
                    !form.revealDate ||
                    loading
                  }
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {loading ? "Creating on-chain... ⏳" : "🎁 Create Gift Drop"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}