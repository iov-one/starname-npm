import { StarnameClient } from "../starnameClient";
import { Task } from "../starnameClient/task";
import { Validator } from "../types/delegationValidator";
import { Escrow } from "../types/escrow";

const reverseLookup = async (
  client: StarnameClient,
  address: string,
): Promise<string> => {
  const task = client.resourceAccounts(address);
  const list = await task.run();
  if (list.length === 0) {
    return address;
  } else {
    return list.join(", ");
  }
};

const getValidator = async (
  client: StarnameClient,
  address: string,
): Promise<Validator> => {
  const task = client.getValidator(address);
  return task.run();
};

const getEscrow = async (
  client: StarnameClient,
  id: string,
): Promise<Escrow> => {
  return Task.toPromise(client.getEscrowWithId(id));
};

export { reverseLookup, getValidator, getEscrow };
