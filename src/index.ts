/* eslint-disable max-classes-per-file */
export const DEFAULT_REDACTED_MESSAGE =
  process.env.REDACTED_MESSAGE ?? '<redacted>';

export class Redacted<T = string> {
  private constructor(private readonly value: T) {
    Object.freeze(this);
  }

  static wrap<K extends string>(value: K): Redacted<K> {
    return new Redacted(value);
  }

  static unwrap<K extends string>(redacted: Redacted<K>): K {
    return redacted.value;
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
