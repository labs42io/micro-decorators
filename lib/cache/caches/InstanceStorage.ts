import { CacheService } from './CacheService';
import { CacheServiceFactory } from './CacheServiceFactory';

export class InstanceStorage<K> {

  private readonly map = new WeakMap<any, CacheService<K>>();

  constructor(
    private readonly factory: CacheServiceFactory<K>,
  ) { }

  public get(instance: K): CacheService<K> {
    if (!this.map.has(instance)) {
      const service = this.factory.create();
      this.map.set(instance, service);
    }

    return this.map.get(instance);
  }

}
