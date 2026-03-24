import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiftDrop 🎁 | Surprise Gift Pooling on Stellar",
  description:
    "Pool money with friends for surprise gifts. Funds lock on-chain and release automatically on the special day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}