import { EncodeObject } from "@cosmjs/proto-signing";

export interface Tx<T> extends EncodeObject {
  readonly value: T;
}
