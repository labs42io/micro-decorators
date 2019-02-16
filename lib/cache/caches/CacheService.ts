import { Expiration } from '../expirations/Expiration';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class CacheService<K = any> implements Cache<K> {

  constructor(
    private readonly expiration: Expiration<K>,
    private readonly storage: Storage<K>,
  ) { }

  public set<V>(key: K, value: V): void {
    this.storage.set(key, value);
    if (this.storage.has(key)) {
      this.expiration.add(key);
    }
  }

  public has(key: K): boolean {
    return this.storage.has(key);
  }

  public get<V>(key: K): V {
    this.expiration.touch(key);
    return this.storage.get(key);
  }

}
