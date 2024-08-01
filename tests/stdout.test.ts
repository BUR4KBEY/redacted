import { UNWRAPPED_EXAMPLES, WRAPPED_EXAMPLES } from './constants.test';

const data =
  process.env.TEST_STDOUT === 'WRAPPED' ? WRAPPED_EXAMPLES : UNWRAPPED_EXAMPLES;

for (const example of data) {
  // eslint-disable-next-line no-console
  console.log(example);
}

process.exit(0);
