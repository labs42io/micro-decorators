import { HashService } from '../../utils/hash';
import { CacheOptions } from '../CacheOptions';
import { expirationFactory } from '../expirations/factory';
import { storageFactory } from '../storages/factory';
import { Cache } from './Cache';

export function cacheFactory<K = any>(timeout: number, options: CacheOptions): Cache<K> {
  const storage = storageFactory(options);
  const expiration = expirationFactory(timeout, options);
  const hash = new HashService();

  return new Cache<K>(storage, expiration, hash);
}
