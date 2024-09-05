import { Redacted } from '../src';

export const EXAMPLES: any[] = [
  'random string',
  123,
  Infinity,
  null,
  undefined,
  -Infinity,
  NaN,
  BigInt(123),
  Symbol('test'),
  { hello: 'world', hi: [1, 2, 3] },
  [1, 2, 3, { hello: 'world' }],
  () => {},
  async () => {},
  async () => Promise.resolve({}),
  async () => Promise.reject(new Error('example')),
  new URL('https://example.com'),
  new Date(),
  new Error('random message'),
  new Map([[1, 2]]),
  new Set([1, 2, 3]),
  new WeakMap([[{}, 1]]),
  new WeakSet([{}]),
  /test/,
  // eslint-disable-next-line prefer-regex-literals
  new RegExp('test'),
  new Int8Array([1, 2, 3]),
  new Uint8Array([1, 2, 3]),
  new Uint8ClampedArray([1, 2, 3]),
  new Int16Array([1, 2, 3]),
  new Uint16Array([1, 2, 3]),
  new Int32Array([1, 2, 3]),
  new Uint32Array([1, 2, 3]),
  new Float32Array([1, 2, 3]),
  new Float64Array([1, 2, 3]),
  new BigInt64Array([1n, 2n, 3n]),
  new BigUint64Array([1n, 2n, 3n]),
  new DataView(new ArrayBuffer(8)),
  new ArrayBuffer(8),
  new SharedArrayBuffer(8),
  new Promise(() => {}),
  new Proxy({}, {}),
  Buffer.from('random string')
];
export const WRAPPED_EXAMPLES = EXAMPLES.map(example => Redacted.wrap(example));
export const UNWRAPPED_EXAMPLES = WRAPPED_EXAMPLES.map(example =>
  Redacted.unwrap(example)
);
