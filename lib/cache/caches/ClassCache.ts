import { Expiration } from '../expirations/Expiration';
import { HashService } from '../hash/hash';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class ClassCache<K = any> implements Cache<K> {

  constructor(
    private readonly storage: Storage,
    private readonly expiration: Expiration,
    private readonly hash: HashService,
  ) { }

  public set<V>(key: K, value: V): this {
    const keyHash = this.hash.hash(key);

    this.storage.set(keyHash, value);
    this.expiration.add(keyHash, () => this.delete(keyHash));

    return this;
  }

  public get<V>(key: K): V {
    const keyHash = this.hash.hash(key);

    this.expiration.add(keyHash, () => this.delete(keyHash));
    return this.storage.get(keyHash);
  }

  private delete(key: string): this {
    this.storage.delete(key);

    return this;
  }

}
