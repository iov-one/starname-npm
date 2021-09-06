import { Any } from "@cosmjs/proto-signing/build/codec/google/protobuf/any";
import { Coin } from "@cosmjs/stargate";
import { Log } from "@cosmjs/stargate/build/logs";

import { PaginationPage } from "./page";

export interface StargateTxBody<T> {
  messages: ReadonlyArray<T>;
  memo?: string;
  timeoutHeight?: Long;
  extensionOptions?: Any[];
  nonCriticalExtensionOptions?: Any[];
}

export interface StargateTx<T> {
  "@type": string;
  body: StargateTxBody<T>;
  auth_info: {
    signer_infos: ReadonlyArray<{
      public_key: {
        "@type": string;
        key: string;
      };
      mode_info: {
        single: {
          mode: string;
        };
      };
      sequence: string;
    }>;
    fee: {
      amount: ReadonlyArray<Coin>;
      gas_limit: string;
      payer: string;
      granter: string;
    };
  };
  signatures: ReadonlyArray<string>;
}

export interface StargateBaseTx<T> {
  height: string;
  gas_used: string;
  gas_wanted: string;
  logs: ReadonlyArray<Log>;
  raw_log: string;
  timestamp: string;
  tx: StargateTx<T>;
  txhash: string;
  data: string;
  codespace: string;
  code: string;
  info: string;
}

export interface StargateSearchTxResponse {
  txs: ReadonlyArray<any>;
  tx_responses: ReadonlyArray<StargateBaseTx<any>>;
  pagination: PaginationPage;
}
