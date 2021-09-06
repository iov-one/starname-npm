import api from "api";
import { Validator } from "types/delegationValidator";

const reverseLookup = async (address: string): Promise<string> => {
  const task = api.resourceAccounts(address);
  const list = await task.run();
  if (list.length === 0) {
    return address;
  } else {
    return list.join(", ");
  }
};

const getValidator = async (address: string): Promise<Validator> => {
  const task = api.getValidator(address);
  return task.run();
};

export { reverseLookup, getValidator };
