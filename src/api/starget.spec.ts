import api from "api";
import { FetchError } from "api/http";
import { setupTest } from "jest.setup";

describe("Stargate Api Implementation", (): void => {
  beforeAll(async (): Promise<void> => {
    await setupTest();
  });

  it("Throws when querying a starname if it does not exist", async (): Promise<void> => {
    // Register a starname
    const testName = "*example";
    const starnameTask = api.getStarname(testName);
    await expect(starnameTask.run()).rejects.toEqual(
      new FetchError(
        3,
        `not found: ${testName}: account does not exist: invalid request`,
        [],
      ),
    );
  });
});
