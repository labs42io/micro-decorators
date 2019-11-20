import { Cache } from '../caches/Cache';
import { CacheFactory } from '../caches/factory';
import { CacheProvider } from './CacheProvider';

export class ClassCacheProvider<K = any> implements CacheProvider<K> {

  private cache: Cache<K> = null;

  constructor(private readonly cacheFactory: CacheFactory) { }

  public get(): Cache<K> {
    if (!this.cache) {
      this.cache = this.cacheFactory.create();
    }

    return this.cache;
  }

}
