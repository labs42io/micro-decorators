import { Expiration } from '../expirations/Expiration';
import { HashService } from '../../utils/hash/hash';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class ClassCache<K = any> implements Cache<K> {

  constructor(
    private readonly storage: Storage,
    private readonly expiration: Expiration,
    private readonly hash: HashService,
  ) { }

  public async set<V>(key: K, value: V): Promise<void> {
    const keyHash = this.hash.calculate(key);

    await this.storage.set(keyHash, value);
    this.expiration.add(keyHash, key => this.delete(key));
  }

  public async get<V>(key: K): Promise<V> {
    const keyHash = this.hash.calculate(key);

    this.expiration.add(keyHash, key => this.delete(key));
    return this.storage.get<V>(keyHash);
  }

  private async delete(key: string): Promise<void> {
    await this.storage.delete(key);
  }

}
