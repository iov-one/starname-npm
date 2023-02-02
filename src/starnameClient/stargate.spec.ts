import { isDeliverTxSuccess } from "@cosmjs/stargate";
import { createClient, createWallet, randomName } from "../jest.setup";
import { StarnameClient } from "../starnameClient";
import { FetchError } from "../starnameClient/http";
import { Wallet } from "../wallet";

jest.setTimeout(50000);

describe("Stargate Api Implementation", (): void => {
  let wallet: Wallet;
  let starnameClient: StarnameClient;

  beforeAll(async (): Promise<void> => {
    starnameClient = await createClient();
    wallet = await createWallet(starnameClient);
  });

  const testName = randomName();

  it("Throws when querying a starname if it does not exist", async (): Promise<void> => {
    // Register a starname
    const starnameTask = starnameClient.getStarnameInfo(`*${testName}`);
    await expect(starnameTask.run()).rejects.toEqual(
      new FetchError(
        3,
        `not found: *${testName}: account does not exist: invalid request`,
        [],
      ),
    );
  });

  it("Registers a premium starname correctly", async (): Promise<void> => {
    // Register a starname
    const result = await wallet.registerDomain(testName);

    expect(isDeliverTxSuccess(result)).toBe(true);
  });

  it("Can query an existing starname correctly", async (): Promise<void> => {
    const address = await wallet.getAddress();
    // Register a starname
    const starnameTask = starnameClient.getStarnameInfo(`*${testName}`);
    const starname = await starnameTask.run();
    expect(starname.name).toEqual("");
    expect(starname.domain.name).toEqual(testName);
    expect(starname.owner).toEqual(address);
    expect(starname.certificates).toHaveLength(0);
    expect(starname.resources).toHaveLength(0);
  });
});
