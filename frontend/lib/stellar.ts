import * as StellarSdk from "@stellar/stellar-sdk";

export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";

export const GIFT_DROP_CONTRACT = process.env.NEXT_PUBLIC_GIFT_DROP_CONTRACT!;
export const GIFT_FACTORY_CONTRACT = process.env.NEXT_PUBLIC_GIFT_FACTORY_CONTRACT!;

// Horizon server
export const getHorizon = () => {
  return new StellarSdk.Horizon.Server(HORIZON_URL);
};

// Connect Freighter wallet
export const connectWallet = async (): Promise<string> => {
  try {
    const freighter = await import("@stellar/freighter-api");

    // Request access
    await freighter.requestAccess();
    
    const { address } = await freighter.getAddress();
    if (!address) throw new Error("No address found");
    return address;
  } catch (error) {
    throw new Error("Failed to connect wallet: " + error);
  }
};

// Get wallet address
export const getWalletAddress = async (): Promise<string | null> => {
  try {
    const freighter = await import("@stellar/freighter-api");
    const { address } = await freighter.getAddress();
    return address || null;
  } catch {
    return null;
  }
};

// Sign transaction
export const signTransaction = async (xdr: string): Promise<string> => {
  try {
    const freighter = await import("@stellar/freighter-api");
    const { signedTxXdr } = await freighter.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    return signedTxXdr;
  } catch (error) {
    throw new Error("Failed to sign transaction: " + error);
  }
};

// Format XLM amount
export const formatXLM = (amount: string | number): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return (num / 10_000_000).toFixed(2);
};

// Convert XLM to stroops
export const toStroops = (xlm: number): string => {
  return Math.floor(xlm * 10_000_000).toString();
};

// Shorten address
export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format date to timestamp
export const dateToTimestamp = (date: string): number => {
  return Math.floor(new Date(date).getTime() / 1000);
};

// Format timestamp to date
export const timestampToDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};