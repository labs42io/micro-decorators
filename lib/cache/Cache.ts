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
    if (this.storage.size < this.limit) {
      return;
    }

    const timeout = setTimeout(
      () => this.deleteCahce(key),
      this.timeout,
    );

    const data: CacheValue<V> = { timeout, value };
    this.storage.set(key, data);
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public get(key: K): V {
    const value = this.storage.get(key).value;

    if (this.expiration === 'sliding') {
      this.resetCache(key, value);
    }

    return value;
  }

  private resetCache(key: K, value: V): void {
    this.deleteCahce(key);
    this.add(key, value);
  }

  private deleteCahce(key: K): void {
    const value = this.storage.get(key);
    clearTimeout(value.timeout);
    this.storage.delete(key);
  }
}
