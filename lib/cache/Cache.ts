import { Storage } from './Storage';
import { ExpirationStrategy } from './ExpirationStrategy';

export class Cache<K = any> {

  constructor(
    private readonly expiration: ExpirationStrategy<K>,
    private readonly storage: Storage<K>,
  ) { }

  public set<V>(key: K, value: V): void {
    this.expiration.add(key);
    this.storage.set(key, value);
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public get<V>(key: K): V {
    this.expiration.update(key);
    return this.storage.get(key);
  }

}
