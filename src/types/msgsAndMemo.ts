import { EncodeObject } from "@cosmjs/proto-signing";

export interface MsgsAndMemo {
  readonly messages: ReadonlyArray<EncodeObject>;
  readonly memo: string;
}
