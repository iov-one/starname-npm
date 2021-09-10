import { StarnameApi } from "api";
import { Validator } from "types/delegationValidator";

const reverseLookup = async (
  starnameApi: StarnameApi,
  address: string,
): Promise<string> => {
  const task = starnameApi.resourceAccounts(address);
  const list = await task.run();
  if (list.length === 0) {
    return address;
  } else {
    return list.join(", ");
  }
};

const getValidator = async (
  starnameApi: StarnameApi,
  address: string,
): Promise<Validator> => {
  const task = starnameApi.getValidator(address);
  return task.run();
};

export { reverseLookup, getValidator };
