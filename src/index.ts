export const DEFAULT_REDACTED_MESSAGE =
  process.env.REDACTED_MESSAGE ?? '<redacted>';

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

  transform<K = T>(fn: (val: T) => K): Redacted<K> {
    const result = fn(Redacted.unwrap(this));

    return new Redacted<K>(result);
  }

  toString(): string {
    return DEFAULT_REDACTED_MESSAGE;
  }

  toJSON(): string {
    return DEFAULT_REDACTED_MESSAGE;
  }

  inspect(): string {
    return DEFAULT_REDACTED_MESSAGE;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return DEFAULT_REDACTED_MESSAGE;
  }
}
