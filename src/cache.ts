/**
 * Interface to any storage which supports key-value storage
 */
export abstract class CacheInterface {
  /** Get */
  abstract g(key: string): string | null;
  /** Set */
  abstract s(key: string, value: string): void;
}
