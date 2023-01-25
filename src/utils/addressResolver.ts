import assets from "@iov/asset-directory";

import { StarnameClient } from "../starnameClient";
import { Task } from "../starnameClient/task";

const iovStarnameUri = assets.find(
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
  client: StarnameClient,
  name: string,
): Task<string> => {
  const task = client.resolveStarname(name);

  return {
    run: async (): Promise<string> => {
      const account = await task.run();
      const { resources } = account;
      if (resources !== null) {
        const found = resources.find(
          (resource): boolean =>
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
