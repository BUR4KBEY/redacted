import { fork } from 'child_process';
import { join } from 'path';

import type { Redacted as RedactedType } from '../src';

function createChildProcessToTestStdout(stdout: 'WRAPPED' | 'UNWRAPPED') {
  return new Promise<string[]>(res => {
    const p = fork(join(__dirname, 'stdout.test.ts'), [], {
      execArgv: ['-r', 'ts-node/register'],
      env: { TEST_STDOUT: stdout },
      stdio: 'pipe'
    });

    expect(p.stdout).not.toBe(null);

    const result: string[] = [];

    p.stdout!.on('data', (buffer: Buffer) => {
      for (const item of buffer.toString().split('\n').filter(Boolean)) {
        result.push(item);
      }
    });

    p.on('exit', code => {
      expect(code).toBe(0);
      res(result);
    });
  });
}

describe('Redacted', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should wrap values without exposing them', async () => {
    const { Redacted, DEFAULT_REDACTED_MESSAGE } = await import('../src');
    const { EXAMPLES, WRAPPED_EXAMPLES } = await import('./constants.test');

    expect(WRAPPED_EXAMPLES).not.toStrictEqual(EXAMPLES);

    for (const [index, example] of WRAPPED_EXAMPLES.entries()) {
      expect(example).not.toStrictEqual(EXAMPLES[index]);
      expect(example).toStrictEqual(Redacted.wrap(EXAMPLES[index]));
      expect(example).toBeInstanceOf(Redacted);
      expect(example.toString()).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
      expect(example.toJSON()).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
      expect(example.inspect()).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
      expect(`${example}`).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
      expect(JSON.stringify(example)).toStrictEqual(
        `"${DEFAULT_REDACTED_MESSAGE}"`
      );

      const customInspect: () => void =
        example[
          Symbol.for(
            'nodejs.util.inspect.custom'
          ) as unknown as keyof RedactedType
        ];

      expect(customInspect()).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
    }

    const items = await createChildProcessToTestStdout('WRAPPED');

    for (const item of items) {
      expect(item).toStrictEqual(DEFAULT_REDACTED_MESSAGE);
    }
  });

  it('should unwrap redacted values', async () => {
    const { Redacted, DEFAULT_REDACTED_MESSAGE } = await import('../src');
    const { EXAMPLES, WRAPPED_EXAMPLES, UNWRAPPED_EXAMPLES } = await import(
      './constants.test'
    );

    expect(UNWRAPPED_EXAMPLES).toStrictEqual(EXAMPLES);

    for (const [index, example] of UNWRAPPED_EXAMPLES.entries()) {
      expect(example).toStrictEqual(EXAMPLES[index]);
      expect(example).toStrictEqual(Redacted.unwrap(WRAPPED_EXAMPLES[index]));
      expect(example).not.toBeInstanceOf(Redacted);
    }

    const items = await createChildProcessToTestStdout('UNWRAPPED');

    for (const item of items) {
      expect(item).not.toStrictEqual(DEFAULT_REDACTED_MESSAGE);
    }
  });

  it('should change the default redacted message', async () => {
    const msg = '[REDACTED]';

    process.env.REDACTED_MESSAGE = msg;

    const { DEFAULT_REDACTED_MESSAGE } = await import('../src');

    expect(DEFAULT_REDACTED_MESSAGE).toStrictEqual(msg);
  });

  it('should prevent modification of redacted instance value', async () => {
    const { Redacted } = await import('../src');

    const redacted = Redacted.wrap('test');

    expect(Object.isFrozen(redacted)).toBe(true);

    expect(() => {
      (redacted as any).value = 'changed';
    }).toThrow(TypeError);

    expect(Redacted.unwrap(redacted)).toStrictEqual('test');
    expect(Redacted.unwrap(redacted)).not.toStrictEqual('changed');
  });
});
