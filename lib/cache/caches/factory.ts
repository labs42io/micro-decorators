import { Factory } from '../../interfaces/factory';
import { HashService } from '../../utils/hash';
import { ExpirationFactory } from '../expirations/factory';
import { StorageFactory } from '../storages/factory';
import { Cache } from './Cache';

export class CacheFactory<K = any> implements Factory<Cache<K>> {

  constructor(
    private readonly hash: HashService,
    private readonly expirationFactory: ExpirationFactory,
    private readonly storageFactory: StorageFactory,
  ) { }

  public create(): Cache<K> {
    const storage = this.storageFactory.create();
    const expiration = this.expirationFactory.create();

    return new Cache(storage, expiration, this.hash);
  }

}
