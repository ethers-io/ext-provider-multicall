Ethers: MulticallProvider
=========================

The MulticallProvider is designed to reduce the latency and large
number of calls that can occur, especially on the initial loading
of page.

It uses a modified version of the [multicall3](https://www.multicall3.com)
contract in a initcode Ethereum call to aggregate many calls into a single
`call` request to a node.

This does not require the multicall contract be deployed to the network,
but is only designed to assist in read-only call operations, and does not
currently support sending multicall transactions.


Installing
----------

```shell
/home/ricmoo> npm install @ethers-ext/provider-multicall
```


Usage
-----

```javascript
import { MulticallProvider } from "@ethers-ext/provider-multicall";

// Create the provider which will serve as the main transport
const provider = new InfuraProvider();

// Crate the multicall provider, which will aggregate calls
const multicaller = new MulticallProvider(provider);

// Connect your contracts to the multicaller
const dai = new Contract("dai.tokens.ethers.eth, daiAbi, multicaller);

// Make your multicalls
const [ sym, name, totalSupply ] = await Promise.all([
  dai.symbol(),
  dai.name(),
  dai.totalSupply(),
]);
```


API
---

### `new MulticallProvider(provider)`

Create a new MulticallProvider using `provider` as the transport.

### `provider.queueCall(to, data) => Promise<Array<{ status: boolean, data: string }>>``

Place a call into the queue to be called on the next drain. Any normal
`provider.call` will call this internally.

### `provider.drainCallQueue() => Promise<Array<{ status: boolean, data: string }>>``

Regardless of the remaining time before the `drainInterval`, trigger all
calls. This **must** be called explicitly when using *manual drain* (i.e.
the `drainInterval` is `-1`).

### `provider.drainInterval`

The drainInterval (by default, 10ms) specifies the interval to aggregate
calls within. If the `drainInterval` is set to `0`, then only calls
made within a single event loop will be aggregated and if `-1` is used
then the `provider.drainCallQueue` MUST be called manually.

Pay special attention when using manual a `drainInterval`, as it can
easily lead to deadlock, if a response is `await`-ed without another
execution in the event loop to trigger a drain.


License
-------

MIT License.
