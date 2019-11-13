import { Cache } from '../caches/Cache';
import { CacheManager } from './CacheManager';
import { cacheFactory } from '../caches/factory';
import { CacheOptions } from '../CacheOptions';
import { ClassType } from '../../interfaces/class';

export class InstanceCacheManager<K = any> implements CacheManager<K> {

  private cacheByInstances = new WeakMap<ClassType, Cache<K>>();

  constructor(
    private readonly timeout: number,
    private readonly options: Readonly<CacheOptions>,
  ) { }

  public get(instance: ClassType): Cache<K> {
    const shouldCreateCache = !this.cacheByInstances.has(instance);
    if (shouldCreateCache) {
      const cache = cacheFactory(this.timeout, this.options);
      this.cacheByInstances.set(instance, cache);
    }

    return this.cacheByInstances.get(instance);
  }

}
