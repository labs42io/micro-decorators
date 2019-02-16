import { CacheOptions } from '..';
import { DEFAULT_OPTIONS, DEFAULT_SCOPE } from '../CacheOptions';
import { Cache } from '../caches/Cache';
import { CacheServiceFactory } from '../caches/CacheServiceFactory';
import { ClassCache } from '../caches/ClassCache';
import { InstanceCache } from '../caches/InstanceCache';
import { InstanceStorage } from '../caches/InstanceStorage';

export function cacheFactory<K = any>(
  timeout: number,
  options: CacheOptions = DEFAULT_OPTIONS,
): Cache<K> {
  const scope = options.scope || DEFAULT_SCOPE;

  switch (scope) {
    case 'class':
      return classCacheFactory<K>(timeout, options);

    case 'instance':
      return instanceCacheFactory<K>(timeout, options);
  }
}

function classCacheFactory<K>(timeout: number, options: CacheOptions): ClassCache<K> {
  const factory = new CacheServiceFactory<K>(timeout, options);
  return new ClassCache(factory.create());
}

function instanceCacheFactory<K>(timeout: number, options: CacheOptions): InstanceCache<K> {
  const factory = new CacheServiceFactory<K>(timeout, options);
  const instanceStorage = new InstanceStorage(factory);
  return new InstanceCache(instanceStorage);
}
