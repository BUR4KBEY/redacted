export const DEFAULT_REDACTED_MESSAGE = '<redacted>';
export const REDACTED_MESSAGE =
  process.env.REDACTED_MESSAGE ?? DEFAULT_REDACTED_MESSAGE;

export class Redacted<T = unknown> {
  private constructor(private readonly value: T) {
    Object.freeze(this);
  }

  static wrap<K = unknown>(value: K): Redacted<K> {
    return new Redacted(value);
  }

  static unwrap<K = unknown>(redacted: Redacted<K>): K {
    return redacted.value;
  }

  transform<K>(fn: (val: T) => Promise<K>): Promise<Redacted<K>>;

  transform<K>(fn: (val: T) => K): Redacted<K>;

  transform<K>(
    fn: (val: T) => K | Promise<K>
  ): Redacted<K> | Promise<Redacted<K>> {
    const result = fn(Redacted.unwrap(this));

    if (result instanceof Promise) {
      return result.then(res => new Redacted(res));
    }

    return new Redacted(result);
  }

  toString(): string {
    return REDACTED_MESSAGE;
  }

  toJSON(): string {
    return REDACTED_MESSAGE;
  }

  inspect(): string {
    return REDACTED_MESSAGE;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return REDACTED_MESSAGE;
  }
}
