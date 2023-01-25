import { Asset } from "@iov/asset-directory";

import { FAVORITE_ASSET_URI } from "../constants/favoriteAssetUri";
import { Resource } from "../proto/iov/starname/v1beta1/types";
import { StarnameClient } from "../starnameClient";

export interface AssetResource {
  readonly id: string;
  readonly address: string;
  readonly asset: Asset;
}

export const getPreferredAsset = (
  resources: ReadonlyArray<Resource> | null,
): string => {
  if (resources === null) return "";
  const found: Resource | undefined = resources.find(
    (resource: Resource): boolean => {
      return resource.uri === FAVORITE_ASSET_URI;
    },
  );
  if (found !== undefined) {
    return found.resource;
  } else {
    return "";
  }
};

export const getTargetsFromResources = (
  starnameClient: StarnameClient,
  resources: ReadonlyArray<Resource> | null,
): ReadonlyArray<AssetResource> => {
  if (resources === null) return [];
  return resources
    .filter(({ uri }: Resource): boolean => uri.startsWith("asset:"))
    .map((item: Resource, index: number): AssetResource => {
      const asset: Asset | undefined = starnameClient.getAssetByUri(item.uri);
      if (asset === undefined) {
        const { uri } = item;
        const symbol: string = uri.replace("asset:", "");
        return {
          id: "unknown" + index,
          address: item.resource,
          asset: {
            "starname-uri": uri,
            name: symbol.toUpperCase(),
            symbol: symbol.toUpperCase(),
            logo: "",
            "trustwallet-uid": null,
            coingeckoId: null,
          },
        };
      } else {
        return {
          id: item.uri,
          address: item.resource,
          asset: asset,
        };
      }
    });
};
