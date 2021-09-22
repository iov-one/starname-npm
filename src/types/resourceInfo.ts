import { StarnameClient } from "../api";
import { FAVORITE_ASSET_URI } from "../constants/favoriteAssetUri";
import { Resource } from "../proto/types";
import { Asset } from "../types/asset";

export interface ResourceInfo {
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
): ReadonlyArray<ResourceInfo> => {
  if (resources === null) return [];
  return resources
    .filter(({ uri }: Resource): boolean => uri.startsWith("asset:"))
    .map((item: Resource, index: number): ResourceInfo => {
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
            denom: "u" + symbol.toLowerCase(),
            logo: "",
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
