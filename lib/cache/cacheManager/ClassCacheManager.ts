import { Cache } from '../caches/Cache';
import { CacheManager } from './CacheManager';
import { cacheFactory } from '../caches/factory';
import { CacheOptions } from '../CacheOptions';

export class ClassCacheManager<K = any> implements CacheManager<K> {

  private cacheInstance: Cache<K> = null;

  constructor(
    private readonly timeout: number,
    private readonly options: Readonly<CacheOptions>,
  ) { }

  public get(): Cache<K> {
    if (!this.cacheInstance) {
      this.cacheInstance = cacheFactory(this.timeout, this.options);
    }

    return this.cacheInstance;
  }

}
