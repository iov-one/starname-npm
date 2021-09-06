import { NameItem } from "./nameItem";

export interface NameViewData {
  readonly starnames: ReadonlyArray<NameItem>;
  readonly domains: ReadonlyArray<NameItem>;
}
