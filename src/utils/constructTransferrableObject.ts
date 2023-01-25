import { fromBase64, fromBech32 } from "@cosmjs/encoding";

import { Any } from "../proto/google/protobuf/any";
import { Account, Domain } from "../proto/iov/starname/v1beta1/types";
import { TxType } from "../starnameRegistry";
import { isDomain, Starname } from "../types/starname";

export const constructTransferrableObject = (item: Starname): Any => {
  if (isDomain(item)) {
    return {
      typeUrl: TxType.Starname.Domain,
      value: Uint8Array.from(
        Domain.encode({
          name: item.name,
          type: item.type,
          // we can safely do this as we know we init it with (vUntil* 1000)
          validUntil: item.validUntil / 1000,
          admin: fromBech32(item.admin).data,
          broker:
            item.broker !== undefined && item.broker
              ? fromBech32(item.broker).data
              : new Uint8Array(),
        }).finish(),
      ),
    };
  }
  return {
    typeUrl: TxType.Starname.Account,
    value: Uint8Array.from(
      Account.encode({
        certificates: item.certificates.map(fromBase64),
        domain: item.domain,
        name: item.name,
        validUntil: item.validUntil / 1000,
        metadataUri: item.metadata_uri ?? "",
        resources: [...item.resources],
        owner: fromBech32(item.owner).data,
        broker:
          item.broker !== undefined && item.broker
            ? fromBech32(item.broker).data
            : new Uint8Array(),
      }).finish(),
    ),
  };
};
