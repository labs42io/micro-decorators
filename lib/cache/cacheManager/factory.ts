import { CacheOptions } from '../CacheOptions';
import { CacheManager } from './CacheManager';
import { ClassCacheManager } from './ClassCacheManager';
import { InstanceCacheManager } from './InstanceCacheManager';

const cacheManagerFactories: ReadonlyMap<
  'class' | 'instance',
  <K>(timeout: number, options: CacheOptions) => CacheManager<K>
> = new Map<'class' | 'instance', <K>(timeout: number, options: CacheOptions) => CacheManager<K>>()
  .set('class', (timeout, options) => new ClassCacheManager<any>(timeout, options))
  .set('instance', (timeout, options) => new InstanceCacheManager<any>(timeout, options));

export function cacheManagerFactory<K = any>(
  timeout: number,
  options: CacheOptions,
): CacheManager<K> {

  const { scope } = options;

  const factory = cacheManagerFactories.get(scope);

  if (!factory) {
    throw new Error(`@cache invalid scope option: ${scope}.`);
  }

  return factory<K>(timeout, options);
}
