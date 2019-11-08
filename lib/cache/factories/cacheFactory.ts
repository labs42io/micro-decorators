import { CacheOptions } from '..';
import { DEFAULT_OPTIONS, DEFAULT_SCOPE } from '../CacheOptions';
import { Cache } from '../caches/Cache';
import { ClassCache } from '../caches/ClassCache';
import { InstanceCache } from '../caches/InstanceCache';
import { HashService } from '../hash/hash';
import { expirationFactory } from './expirationFactory';
import { storeFactory } from './storeFactory';

export function cacheFactory<K = any>(
  timeout: number,
  options: CacheOptions = DEFAULT_OPTIONS,
): Cache<K> {
  const scope = options.scope || DEFAULT_SCOPE;

  const hash = new HashService();

  switch (scope) {
    case 'class':
      const storage = storeFactory(options);
      const expiration = expirationFactory(timeout, options);
      return new ClassCache<K>(storage, expiration, hash);

    case 'instance':
      return new InstanceCache(
        () => storeFactory(options),
        () => expirationFactory(timeout, options),
        hash,
      );

    default:
      throw new Error(`@cahce Scope type is not suported: ${scope}.`);
  }
}
