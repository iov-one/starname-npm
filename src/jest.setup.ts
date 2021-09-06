import "isomorphic-fetch";

import api from "api";

export const setupTest = async (): Promise<void> => {
  await api.initialize(
    "http://localhost:26657" /* rpcUrl */,
    "http://localhost:1317" /* apiUrl */,
    "" /* validatorsInfoUrl */,
    {
      IOV: {
        subunitName: "uiov",
        subunitsPerUnit: 1000000000,
        ticker: "IOV",
      },
    } /* tokens */,
    {
      denom: "uiov",
      logo: "",
      "starname-uri": "",
      "caip-19": "",
      name: "IOV",
      symbol: "IOV",
    } /* mainAsset */,
    /* broker */
  );
};
