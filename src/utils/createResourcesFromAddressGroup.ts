import { AddressGroup } from "../types/addressGroup";
import { ChainMap } from "../types/chainMap";
import { Resource } from "../types/resource";

export const createResourcesFromAddressGroup = (
  addressGroup: AddressGroup,
  chains: ChainMap,
): Array<Resource> => {
  return Object.keys(addressGroup).map((chainId) => {
    const symbol = chains[chainId].symbol;
    return {
      uri: `asset:${symbol.toLowerCase()}`,
      // signers sends it on 0th index
      resource: addressGroup[chainId][0].address,
    };
  });
};
