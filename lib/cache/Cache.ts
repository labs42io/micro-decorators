import { StorageType } from './StorageType';
import { ExpirationStrategy } from './ExpirationStrategy';

export class Cache<K, V> {

  constructor(
    private readonly expiration: ExpirationStrategy<K>,
    private readonly storage: StorageType<K, V>,
  ) { }

  public set(key: K, value: V): void {
    this.expiration.add(key);
    this.storage.set(key, value);
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public get(key: K): V {
    this.expiration.update(key);
    return this.storage.get(key);
  }

}
