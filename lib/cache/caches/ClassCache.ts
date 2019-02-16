import { Cache } from './Cache';
import { CacheService } from './CacheService';

export class ClassCache<K = any> implements Cache<K> {

  constructor(
    private readonly cacheService: CacheService<K>,
  ) { }

  public set<V>(key: K, value: V): void {
    this.cacheService.set(key, value);
  }

  public has(key: K): boolean {
    return this.cacheService.has(key);
  }

  public get<V>(key: K): V {
    return this.cacheService.get(key);
  }

}
