/**
 * Default message used to represent redacted values.
 * @constant
 */
export const DEFAULT_REDACTED_MESSAGE = '<redacted>';

/**
 * The redacted message, configurable via the `REDACTED_MESSAGE` environment variable.
 * @constant
 */
export const REDACTED_MESSAGE =
  process.env.REDACTED_MESSAGE ?? DEFAULT_REDACTED_MESSAGE;

/**
 * A class that wraps a value and redacts its string representations.
 * Useful for securely handling sensitive information without exposing it in logs or outputs.
 *
 * @template T Type of the value being redacted.
 */
export class Redacted<T = unknown> {
  /**
   * Private constructor. Use {@link Redacted.wrap} to create a new instance.
   * @param value The value to wrap and redact.
   */
  private constructor(private readonly value: T) {
    Object.freeze(this);
  }

  /**
   * Wraps a value in a Redacted instance.
   * @template K Type of the value.
   * @param value The value to redact.
   * @returns A Redacted instance containing the value.
   */
  static wrap<K = unknown>(value: K): Redacted<K> {
    return new Redacted(value);
  }

  /**
   * Extracts the original value from a Redacted instance.
   * @template K Type of the value.
   * @param redacted A Redacted instance.
   * @returns The unwrapped original value.
   */
  static unwrap<K = unknown>(redacted: Redacted<K>): K {
    return redacted.value;
  }

  /**
   * Transforms the redacted value with a given function.
   * Returns a new Redacted instance containing the transformed result.
   * Supports both synchronous and asynchronous transformations.
   *
   * @template K The return type of the transformation function.
   * @param fn The function to apply to the redacted value.
   * @returns A new Redacted instance or a Promise resolving to one.
   */
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

  /**
   * Returns a string representation of the redacted value.
   * Always returns the redacted message.
   * @returns A redacted string.
   */
  toString(): string {
    return REDACTED_MESSAGE;
  }

  /**
   * Returns a JSON-safe representation of the redacted value.
   * Always returns the redacted message.
   * @returns A redacted string.
   */
  toJSON(): string {
    return REDACTED_MESSAGE;
  }

  /**
   * Used by Node.js inspection utilities to return the redacted message.
   * @returns A redacted string.
   */
  inspect(): string {
    return REDACTED_MESSAGE;
  }

  /**
   * Custom inspect function for Node.js (Symbol-based).
   * Ensures even deep inspection won't reveal the internal value.
   * @returns A redacted string.
   */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return REDACTED_MESSAGE;
  }
}
