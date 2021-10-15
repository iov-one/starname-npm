import { SinglePubkey } from "@cosmjs/amino";

export interface CosmosAccountResponse {
  readonly account: {
    readonly type: string;
    readonly address: string;
    readonly pub_key: SinglePubkey;
    readonly account_number: string;
    readonly sequence: string;
  };
}
