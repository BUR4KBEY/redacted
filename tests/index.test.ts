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

      const customInspect =
        example[
          Symbol.for(
            'nodejs.util.inspect.custom'
          ) as unknown as keyof RedactedType
        ];

      expect((customInspect as () => string)()).toStrictEqual(
        DEFAULT_REDACTED_MESSAGE
      );
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

    const { REDACTED_MESSAGE } = await import('../src');

    expect(REDACTED_MESSAGE).toStrictEqual(msg);
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

  it('should allow transformation of redacted values while preserving redaction', async () => {
    const { Redacted } = await import('../src');
    const { createHash } = await import('node:crypto');

    const value = 'test';
    const getSHA256Hash = (str: string) =>
      createHash('sha256').update(str).digest('hex');

    const redacted = Redacted.wrap(value);
    const transformed = redacted.transform(x => getSHA256Hash(x));

    expect(redacted).toBeInstanceOf(Redacted);
    expect(transformed).toBeInstanceOf(Redacted);

    expect(Redacted.unwrap(redacted)).toStrictEqual(value);
    expect(Redacted.unwrap(transformed)).toStrictEqual(getSHA256Hash(value));
  });

  it('should transform redacted values to different types while preserving redaction', async () => {
    const { Redacted } = await import('../src');

    const val1 = '123';
    const val2 = '{"hello":"world"}';

    const r1 = Redacted.wrap(val1);
    const r2 = Redacted.wrap(val2);

    const t1 = r1.transform(x => Number(x));
    const t2 = r2.transform(x => JSON.parse(x) as { hello: string });

    expect(r1).toBeInstanceOf(Redacted);
    expect(r2).toBeInstanceOf(Redacted);
    expect(t1).toBeInstanceOf(Redacted);
    expect(t2).toBeInstanceOf(Redacted);

    expect(Redacted.unwrap(r1)).toStrictEqual(val1);
    expect(Redacted.unwrap(r2)).toStrictEqual(val2);

    expect(Redacted.unwrap(t1)).toStrictEqual(Number(val1));
    expect(Redacted.unwrap(t2)).toStrictEqual(JSON.parse(val2));
    expect(Redacted.unwrap(t2).hello).toStrictEqual('world');
  });

  it('should allow async transformation of redacted values', async () => {
    const { Redacted } = await import('../src');

    const value = 'hello';
    const asyncUppercase = async (s: string): Promise<string> => {
      await new Promise(resolve => {
        setTimeout(resolve, 10);
      });
      return s.toUpperCase();
    };

    const redacted = Redacted.wrap(value);
    const transformed = await redacted.transform(asyncUppercase);

    expect(redacted).toBeInstanceOf(Redacted);
    expect(transformed).toBeInstanceOf(Redacted);

    expect(Redacted.unwrap(transformed)).toStrictEqual('HELLO');
  });

  it('should support async transform to different type', async () => {
    const { Redacted } = await import('../src');

    const value = 'true';
    const asyncParseBoolean = async (str: string): Promise<boolean> => {
      await new Promise(resolve => {
        setTimeout(resolve, 10);
      });
      return str === 'true';
    };

    const redacted = Redacted.wrap(value);
    const transformed = await redacted.transform(asyncParseBoolean);

    expect(transformed).toBeInstanceOf(Redacted);
    expect(Redacted.unwrap(transformed)).toBe(true);
  });

  it('should correctly handle mixed sync and async transform usage', async () => {
    const { Redacted } = await import('../src');

    const redacted = Redacted.wrap('42');

    const syncTransformed = redacted.transform(s => Number(s));
    const asyncTransformed = await redacted.transform(async s => Number(s));

    expect(syncTransformed).toBeInstanceOf(Redacted);
    expect(asyncTransformed).toBeInstanceOf(Redacted);

    expect(Redacted.unwrap(syncTransformed)).toBe(42);
    expect(Redacted.unwrap(asyncTransformed)).toBe(42);
  });
});
