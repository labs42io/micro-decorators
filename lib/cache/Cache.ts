import { StorageType } from './StorageType';

interface CacheValue<V> {
  timeout: NodeJS.Timeout;
  value: V;
}

export class Cache<K, V> {
  constructor(
    private readonly timeout: number,
    private readonly expiration: 'absolute' | 'sliding',
    private readonly storage: StorageType<K, CacheValue<V>>,
    private readonly limit: number,
  ) { }

  public add(key: K, value: V): void {
    this.has(key)
      ? this.resetCache(key, value)
      : this.setCache(key, value);
  }

  public has(key: K): boolean {
    if (!this.storage.has(key)) {
      return false;
    }

    this.resetCache(key, this.get(key));

    return true;
  }

  public get(key: K): V {
    const defaultValue = { value: undefined };
    return (this.storage.get(key) || defaultValue).value;
  }

  private resetCache(key: K, value: V): void {
    this.deleteCahce(key);
    this.setCache(key, value);
  }

  private deleteCahce(key: K): void {
    const value = this.storage.get(key);
    clearTimeout(value.timeout);
    this.storage.delete(key);
  }

  private setCache(key: K, value: V): void {
    const timeout = setTimeout(
      () => this.storage.delete(key),
      this.timeout,
    );

    const data: CacheValue<V> = { timeout, value };
    this.storage.set(key, data);
  }
}
