import { ClassType } from '../../interfaces/class';
import { Cache } from '../caches/Cache';
import { CacheFactory } from '../caches/factory';
import { CacheProvider } from './CacheProvider';

export class InstanceCacheProvider<K = any> implements CacheProvider<K> {

  private instanceCaches = new WeakMap<ClassType, Cache<K>>();

  constructor(private readonly cacheFactory: CacheFactory) { }

  public get(instance: ClassType): Cache<K> {
    const hasCache = this.instanceCaches.has(instance);
    if (!hasCache) {
      const cache = this.cacheFactory.create();
      this.instanceCaches.set(instance, cache);
    }

    return this.instanceCaches.get(instance);
  }

}
