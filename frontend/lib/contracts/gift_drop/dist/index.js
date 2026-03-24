import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAGcmVmdW5kAAAAAAACAAAAAAAAAAdnaWZ0X2lkAAAAAAYAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAA==",
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
            "AAAAAAAAAAAAAAAVZ2V0X2NvbnRyaWJ1dG9yX2dpZnRzAAAAAAAAAQAAAAAAAAALY29udHJpYnV0b3IAAAAAEwAAAAEAAAPqAAAABg=="]), options);
        this.options = options;
    }
    fromJSON = {
        refund: (this.txFromJSON),
        release: (this.txFromJSON),
        get_gift: (this.txFromJSON),
        contribute: (this.txFromJSON),
        create_gift: (this.txFromJSON),
        get_gift_count: (this.txFromJSON),
        get_contributors: (this.txFromJSON),
        get_organizer_gifts: (this.txFromJSON),
        get_contributor_gifts: (this.txFromJSON)
    };
}
