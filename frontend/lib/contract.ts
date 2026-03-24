import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction, NETWORK_PASSPHRASE, SOROBAN_RPC } from "./stellar";

const CONTRACT_ID = process.env.NEXT_PUBLIC_GIFT_DROP_CONTRACT!;
const DEPLOYER = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS!;
export const XLM_TOKEN = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

const getServer = () => {
  const sdk = StellarSdk as any;
  if (sdk.SorobanRpc?.Server) return new sdk.SorobanRpc.Server(SOROBAN_RPC);
  if (sdk.Soroban?.Server) return new sdk.Soroban.Server(SOROBAN_RPC);
  if (sdk.rpc?.Server) return new sdk.rpc.Server(SOROBAN_RPC);
  throw new Error("SorobanRpc.Server not found");
};

const parseScVal = (val: any): any => {
  try {
    return StellarSdk.scValToNative(val);
  } catch {
    if (val.switch().name === "scvAddress") {
      try {
        return StellarSdk.Address.fromScVal(val).toString();
      } catch {
        return "unknown";
      }
    }
    if (val.switch().name === "scvMap") {
      const map: any = {};
      val.map().forEach((entry: any) => {
        const key = parseScVal(entry.key());
        const value = parseScVal(entry.val());
        map[key] = value;
      });
      return map;
    }
    if (val.switch().name === "scvVec") {
      return val.vec().map((v: any) => parseScVal(v));
    }
    return null;
  }
};

const buildSimulateTx = async (method: string, args: any[]): Promise<string> => {
  const server = getServer();
  const account = await server.getAccount(DEPLOYER);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build();
  return transaction.toXDR();
};

const readContractRPC = async (method: string, params: any[]): Promise<any> => {
  const txXdr = await buildSimulateTx(method, params);
  const response = await fetch(SOROBAN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "simulateTransaction",
      params: { transaction: txXdr },
    }),
  });
  const data = await response.json();
  if (data.result?.results?.[0]?.xdr) {
    const val = StellarSdk.xdr.ScVal.fromXDR(data.result.results[0].xdr, "base64");
    return parseScVal(val);
  }
  throw new Error("RPC call failed: " + JSON.stringify(data));
};

const invokeContract = async (
  userAddress: string,
  method: string,
  args: any[]
): Promise<any> => {
  const server = getServer();
  const account = await server.getAccount(userAddress);
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build();
  const prepared = await server.prepareTransaction(transaction);
  const xdr = prepared.toXDR();
  const signedXdr = await signTransaction(xdr);
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const sendResult = await server.sendTransaction(signedTx);
  let result = await server.getTransaction(sendResult.hash);
  while (result.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1000));
    result = await server.getTransaction(sendResult.hash);
  }
  return result;
};

export const createGiftDropOnChain = async (
  organiser: string,
  recipient: string,
  targetAmount: number,
  deadline: number,
  revealDate: number,
  occasion: string,
  message: string
): Promise<number> => {
  const result = await invokeContract(organiser, "create_gift", [
    new StellarSdk.Address(organiser).toScVal(),
    new StellarSdk.Address(recipient).toScVal(),
    StellarSdk.nativeToScVal(BigInt(Math.floor(targetAmount * 10_000_000)), { type: "i128" }),
    StellarSdk.nativeToScVal(BigInt(deadline), { type: "u64" }),
    StellarSdk.nativeToScVal(BigInt(revealDate), { type: "u64" }),
    StellarSdk.nativeToScVal(occasion, { type: "string" }),
    StellarSdk.nativeToScVal(message, { type: "string" }),
  ]);
  if (result.status === "SUCCESS" && result.returnValue) {
    return Number(StellarSdk.scValToNative(result.returnValue));
  }
  throw new Error("Failed to create gift drop");
};

export const contributeOnChain = async (
  contributor: string,
  dropId: number,
  amount: number
): Promise<string> => {
  const result = await invokeContract(contributor, "contribute", [
    StellarSdk.nativeToScVal(BigInt(dropId), { type: "u64" }),
    new StellarSdk.Address(contributor).toScVal(),
    StellarSdk.nativeToScVal(BigInt(Math.floor(amount * 10_000_000)), { type: "i128" }),
    new StellarSdk.Address(XLM_TOKEN).toScVal(),
  ]);
  if (result.status === "SUCCESS") {
    return result.txHash || "";
  }
  throw new Error("Failed to contribute");
};

export const getGiftDropFromChain = async (dropId: number): Promise<any> => {
  try {
    return await readContractRPC("get_gift", [
      StellarSdk.nativeToScVal(BigInt(dropId), { type: "u64" }),
    ]);
  } catch (e) {
    console.warn(`Drop #${dropId} fetch failed (may be expired):`, e);
    return null; // don't crash, return null
  }
};

export const getContributionsFromChain = async (dropId: number): Promise<any[]> => {
  const result = await readContractRPC("get_contributors", [
    StellarSdk.nativeToScVal(BigInt(dropId), { type: "u64" }),
  ]);
  return Array.isArray(result) ? result : [];
};

export const getOrganiserDrops = async (organiser: string): Promise<number[]> => {
  const result = await readContractRPC("get_organizer_gifts", [
    new StellarSdk.Address(organiser).toScVal(),
  ]);
  return Array.isArray(result) ? result.map(Number) : [];
};

export const getContributorDrops = async (contributor: string): Promise<number[]> => {
  const result = await readContractRPC("get_contributor_gifts", [
    new StellarSdk.Address(contributor).toScVal(),
  ]);
  return Array.isArray(result) ? result.map(Number) : [];
};

export const getDropCount = async (): Promise<number> => {
  const result = await readContractRPC("get_gift_count", []);
  return Number(result);
};

export const fromStroops = (amount: bigint | number): number => {
  return Number(amount) / 10_000_000;
};
