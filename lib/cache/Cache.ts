import { StorageType } from './StorageType';

interface CacheValue<V> {
  timeout: NodeJS.Timeout;
  value: V;
}

class Cache<K, V> {
  private readonly map = new Map<K, CacheValue<V>>();

  constructor(
    private readonly timeout: number,
    private readonly expiration: 'absolute' | 'sliding',
    private readonly storage: StorageType<K, V>,
    private readonly limit: number,
  ) { }

  public add(key: K, value: V): void {
    this.has(key)
      ? this.resetCache(key, value)
      : this.setCache(key, value);
  }

  public has(key: K): boolean {
    if (!this.map.has(key)) {
      return false;
    }

    this.resetCache(key, this.get(key));

    return true;
  }

  public get(key: K): V {
    const defaultValue = { value: undefined };
    return (this.map.get(key) || defaultValue).value;
  }

  private resetCache(key: K, value: V): void {
    this.deleteCahce(key);
    this.setCache(key, value);
  }

  private deleteCahce(key: K): void {
    const value = this.map.get(key);
    clearTimeout(value.timeout);
    this.map.delete(key);
  }

  private setCache(key: K, value: V): void {
    const timeout = setTimeout(
      () => this.map.delete(key),
      this.timeout,
    );

    const data: CacheValue<V> = { timeout, value };
    this.map.set(key, data);
  }
}
