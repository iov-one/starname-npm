# @iov/starname-npm [![npm version](https://img.shields.io/npm/v/@iov/starname-npm.svg?style=flat-square)](https://www.npmjs.com/package/@iov/starname-npm)

Client library for Starname blockchain.

Packs in a [StarnameClient](/src/starnameClient/index.ts) class that can be used to interact with the Starname blockchain and a [Wallet](/src/wallet.ts) class that can be used to sign transactions.

## Installation

```bash
yarn add @iov/starname-npm
```

## Initialization

```ts
import { SeedPhraseSigner, StarnameClient, Wallet } from "@iov/starname-npm";

const client = await StarnameClient.createConnected(rpcUrl, apiUrl, ...);
// Now for creating a wallet you need a signer
// Lets create and use a mnemonic/seed-phrase signer
const signer = new SeedPhraseSigner();
// Now we need to initialize this signer
// Every signer implementing the Signer interface needs to be initialized
// This is where the signer will be asked to provide authorization for the wallet
// Here we are using random method which can auto generate a random seed phrase
await signer.initializeRandom();
const wallet = new Wallet(signer, starnameClient);
// Our wallet is ready to perform transactions
```

## Usage

Now that we have a client and a wallet...  
We can use our client to (For eg.) resolve a starname.

```ts
const task = client.resolveStarname("alice*iov");
task.run().then((result) => {
  console.log(result);
});
```

And can use our wallet instance to sign and broadcast transactions.

```ts
const result = await wallet.registerDomain("helloworld");
```

For more info you can check out [this](/src/starnameClient/stargate.spec.ts).

Also check out [@iov/wallet-providers](https://github.com/iov-one/wallet-providers) if you are planning on building a web application.
