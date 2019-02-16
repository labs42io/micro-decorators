import { Expiration } from '../expirations/Expiration';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class CacheService<K = any> implements Cache<K> {

  constructor(
    private readonly expiration: Expiration<K>,
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
    this.expiration.touch(key);
    return this.storage.get(key);
  }

}