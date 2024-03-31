# Ethers: MulticallProvider

The MulticallProvider is designed to reduce the latency and large
number of calls that can occur, especially on the initial loading
of page.

This does not require any multicall contract be deployed to the network,
and does not deploy any multicall contract to the network. It is only
designed to assist in read-only call operations, and does not
currently support sending multicall transactions.

For inspiration, see:

- [Ethers v5 multicall](https://github.com/ricmoo/multicall)
- [multicall3](https://www.multicall3.com)

## Installing

```shell
/home/ricmoo> npm install @ethers-ext/provider-multicall
```

## Usage

```javascript
import { MulticallProvider } from "@ethers-ext/provider-multicall";

// Create the provider which will serve as the main transport
const provider = new InfuraProvider();

// Create the multicall provider, which will aggregate calls
const multicaller = new MulticallProvider(provider);

// Connect your contracts to the multicaller
const dai = new Contract("dai.tokens.ethers.eth", "daiAbi", "multicaller");

// Make your multicalls
const [sym, name, totalSupply] = await Promise.all([
  dai.symbol(),
  dai.name(),
  dai.totalSupply(),
]);
```

## API

### `new MulticallProvider(provider)`

Create a new MulticallProvider using `provider` as the transport.

### `provider.queueCall(to, data) => Promise<Array<{ status: boolean, data: string }>>`

Place a call into the queue to be called on the next drain. Any normal
`provider.call` will call this internally.

### `provider.drainCallQueue() => Promise<Array<{ status: boolean, data: string }>>`

Regardless of the remaining time before the `drainInterval`, trigger all
calls. This **must** be called explicitly when using _manual drain_ (i.e.
the `drainInterval` is `-1`).

### `provider.drainInterval`

The drainInterval (by default, 10ms) specifies the interval to aggregate
calls within. If the `drainInterval` is set to `0`, then only calls
made within a single event loop will be aggregated and if `-1` is used
then the `provider.drainCallQueue` MUST be called manually.

Pay special attention when using manual a `drainInterval`, as it can
easily lead to deadlock, if a response is `await`-ed without another
execution in the event loop to trigger a drain.

## Contributing

If the multicall contract is changed (`./contracts/multicall.sol`),
then you must call `npm run build-solc` before the changes will be
added to the `./src.ts/_contract.ts` file, which is a TypeScript
version of the ABI and bytecode, generated using `./src.ts/_build.ts`.

Please open a discussion before making any changes. `:o)`.

## Notes

This is designed for Ethers v6. For Ethers v5, see the old
[Multicaller](https://github.com/ricmoo/multicall/tree/main).

## License

MIT License.
