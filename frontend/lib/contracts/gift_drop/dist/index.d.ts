import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CCKWQPTEXUAV7RK3WKD2T6YS4CLC4QE2KWI2MO4NHVAN4ABFJHA3YGVJ";
    };
};
export type DataKey = {
    tag: "GiftCount";
    values: void;
} | {
    tag: "Gift";
    values: readonly [u64];
} | {
    tag: "Contributors";
    values: readonly [u64];
} | {
    tag: "OrganizerGifts";
    values: readonly [string];
} | {
    tag: "ContributorGifts";
    values: readonly [string];
};
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
    refund: ({ gift_id, token_address }: {
        gift_id: u64;
        token_address: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a release transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    release: ({ gift_id, token_address }: {
        gift_id: u64;
        token_address: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_gift transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_gift: ({ gift_id }: {
        gift_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<GiftDrop>>;
    /**
     * Construct and simulate a contribute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    contribute: ({ gift_id, contributor, amount, token_address }: {
        gift_id: u64;
        contributor: string;
        amount: i128;
        token_address: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a create_gift transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create_gift: ({ organiser, recipient, target_amount, deadline, reveal_date, occasion, message }: {
        organiser: string;
        recipient: string;
        target_amount: i128;
        deadline: u64;
        reveal_date: u64;
        occasion: string;
        message: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a get_gift_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_gift_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a get_contributors transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_contributors: ({ gift_id }: {
        gift_id: u64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<Contribution>>>;
    /**
     * Construct and simulate a get_organizer_gifts transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_organizer_gifts: ({ organiser }: {
        organiser: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<u64>>>;
    /**
     * Construct and simulate a get_contributor_gifts transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_contributor_gifts: ({ contributor }: {
        contributor: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<u64>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        refund: (json: string) => AssembledTransaction<null>;
        release: (json: string) => AssembledTransaction<null>;
        get_gift: (json: string) => AssembledTransaction<GiftDrop>;
        contribute: (json: string) => AssembledTransaction<null>;
        create_gift: (json: string) => AssembledTransaction<bigint>;
        get_gift_count: (json: string) => AssembledTransaction<bigint>;
        get_contributors: (json: string) => AssembledTransaction<Contribution[]>;
        get_organizer_gifts: (json: string) => AssembledTransaction<bigint[]>;
        get_contributor_gifts: (json: string) => AssembledTransaction<bigint[]>;
    };
}
