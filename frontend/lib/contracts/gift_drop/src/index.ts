import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCKWQPTEXUAV7RK3WKD2T6YS4CLC4QE2KWI2MO4NHVAN4ABFJHA3YGVJ",
  }
} as const

export type DataKey = {tag: "GiftCount", values: void} | {tag: "Gift", values: readonly [u64]} | {tag: "Contributors", values: readonly [u64]} | {tag: "OrganizerGifts", values: readonly [string]} | {tag: "ContributorGifts", values: readonly [string]};


export interface GiftDrop {
  current_amount: i128;
  deadline: u64;
  id: u64;
  is_refunded: boolean;
  is_released: boolean;
  message: string;
  occasion: string;
  organiser: string;
  recipient: string;
  reveal_date: u64;
  target_amount: i128;
}


export interface Contribution {
  amount: i128;
  contributor: string;
  timestamp: u64;
}

export interface Client {
  /**
   * Construct and simulate a refund transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  refund: ({gift_id, token_address}: {gift_id: u64, token_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  release: ({gift_id, token_address}: {gift_id: u64, token_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_gift transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_gift: ({gift_id}: {gift_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<GiftDrop>>

  /**
   * Construct and simulate a contribute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  contribute: ({gift_id, contributor, amount, token_address}: {gift_id: u64, contributor: string, amount: i128, token_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_gift transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_gift: ({organiser, recipient, target_amount, deadline, reveal_date, occasion, message}: {organiser: string, recipient: string, target_amount: i128, deadline: u64, reveal_date: u64, occasion: string, message: string}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_gift_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_gift_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_contributors transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_contributors: ({gift_id}: {gift_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Array<Contribution>>>

  /**
   * Construct and simulate a get_organizer_gifts transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_organizer_gifts: ({organiser}: {organiser: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u64>>>

  /**
   * Construct and simulate a get_contributor_gifts transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_contributor_gifts: ({contributor}: {contributor: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u64>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAGcmVmdW5kAAAAAAACAAAAAAAAAAdnaWZ0X2lkAAAAAAYAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAHcmVsZWFzZQAAAAACAAAAAAAAAAdnaWZ0X2lkAAAAAAYAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAIZ2V0X2dpZnQAAAABAAAAAAAAAAdnaWZ0X2lkAAAAAAYAAAABAAAH0AAAAAhHaWZ0RHJvcA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAACUdpZnRDb3VudAAAAAAAAAEAAAAAAAAABEdpZnQAAAABAAAABgAAAAEAAAAAAAAADENvbnRyaWJ1dG9ycwAAAAEAAAAGAAAAAQAAAAAAAAAOT3JnYW5pemVyR2lmdHMAAAAAAAEAAAATAAAAAQAAAAAAAAAQQ29udHJpYnV0b3JHaWZ0cwAAAAEAAAAT",
        "AAAAAAAAAAAAAAAKY29udHJpYnV0ZQAAAAAABAAAAAAAAAAHZ2lmdF9pZAAAAAAGAAAAAAAAAAtjb250cmlidXRvcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAA==",
        "AAAAAQAAAAAAAAAAAAAACEdpZnREcm9wAAAACwAAAAAAAAAOY3VycmVudF9hbW91bnQAAAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAACaWQAAAAAAAYAAAAAAAAAC2lzX3JlZnVuZGVkAAAAAAEAAAAAAAAAC2lzX3JlbGVhc2VkAAAAAAEAAAAAAAAAB21lc3NhZ2UAAAAAEAAAAAAAAAAIb2NjYXNpb24AAAAQAAAAAAAAAAlvcmdhbmlzZXIAAAAAAAATAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAtyZXZlYWxfZGF0ZQAAAAAGAAAAAAAAAA10YXJnZXRfYW1vdW50AAAAAAAACw==",
        "AAAAAAAAAAAAAAALY3JlYXRlX2dpZnQAAAAABwAAAAAAAAAJb3JnYW5pc2VyAAAAAAAAEwAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAANdGFyZ2V0X2Ftb3VudAAAAAAAAAsAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAALcmV2ZWFsX2RhdGUAAAAABgAAAAAAAAAIb2NjYXNpb24AAAAQAAAAAAAAAAdtZXNzYWdlAAAAABAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAOZ2V0X2dpZnRfY291bnQAAAAAAAAAAAABAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADENvbnRyaWJ1dGlvbgAAAAMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAALY29udHJpYnV0b3IAAAAAEwAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==",
        "AAAAAAAAAAAAAAAQZ2V0X2NvbnRyaWJ1dG9ycwAAAAEAAAAAAAAAB2dpZnRfaWQAAAAABgAAAAEAAAPqAAAH0AAAAAxDb250cmlidXRpb24=",
        "AAAAAAAAAAAAAAATZ2V0X29yZ2FuaXplcl9naWZ0cwAAAAABAAAAAAAAAAlvcmdhbmlzZXIAAAAAAAATAAAAAQAAA+oAAAAG",
        "AAAAAAAAAAAAAAAVZ2V0X2NvbnRyaWJ1dG9yX2dpZnRzAAAAAAAAAQAAAAAAAAALY29udHJpYnV0b3IAAAAAEwAAAAEAAAPqAAAABg==" ]),
      options
    )
  }
  public readonly fromJSON = {
    refund: this.txFromJSON<null>,
        release: this.txFromJSON<null>,
        get_gift: this.txFromJSON<GiftDrop>,
        contribute: this.txFromJSON<null>,
        create_gift: this.txFromJSON<u64>,
        get_gift_count: this.txFromJSON<u64>,
        get_contributors: this.txFromJSON<Array<Contribution>>,
        get_organizer_gifts: this.txFromJSON<Array<u64>>,
        get_contributor_gifts: this.txFromJSON<Array<u64>>
  }
}