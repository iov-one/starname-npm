import { StarnameClient } from "../api";
import { Validator } from "../types/delegationValidator";

const reverseLookup = async (
  starnameClient: StarnameClient,
  address: string,
): Promise<string> => {
  const task = starnameClient.resourceAccounts(address);
  const list = await task.run();
  if (list.length === 0) {
    return address;
  } else {
    return list.join(", ");
  }
};

const getValidator = async (
  starnameClient: StarnameClient,
  address: string,
): Promise<Validator> => {
  const task = starnameClient.getValidator(address);
  return task.run();
};

export { reverseLookup, getValidator };
