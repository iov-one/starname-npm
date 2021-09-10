import starnameAssets from "@iov/asset-directory/starname/assets.json";
import { StarnameApi } from "api";
import { Task } from "api/task";
import { Account, Resource } from "proto/types";

const iovStarnameUri = starnameAssets.find(
  (asset: any): boolean => asset.symbol === "IOV",
);

if (iovStarnameUri === undefined) {
  throw new Error(
    "this is impossible, the IOV asset has to be in the asset directory",
  );
}

export const NoIOVAddressLinkedToStarnameError = {
  code: 600,
  title: "" /* Not relevant now */,
  body: "No linked address to this starname",
};

export const getIOVAddressForStarname = (
  api: StarnameApi,
  name: string,
): Task<string> => {
  const task: Task<Account> = api.resolveStarname(name);

  return {
    run: async (): Promise<string> => {
      const account = await task.run();
      const { resources } = account;
      if (resources !== null) {
        const found: Resource | undefined = resources.find(
          (resource: Resource): boolean =>
            resource.uri === iovStarnameUri["starname-uri"],
        );
        if (found === undefined) throw NoIOVAddressLinkedToStarnameError;
        return found.resource;
      } else {
        throw NoIOVAddressLinkedToStarnameError;
      }
    },
    abort: (): void => {
      task.abort();
    },
  };
};
