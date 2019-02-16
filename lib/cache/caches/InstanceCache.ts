import { Cache } from './Cache';
import { InstanceStorage } from './InstanceStorage';

export class InstanceCache<K = any> implements Cache<K> {

  constructor(
    private readonly storage: InstanceStorage<K>,
  ) { }

  public set<V>(key: K, value: V, instance: any): void {
    const cache = this.storage.get(instance);

    return cache.set(key, value);
  }

  public has(key: K, instance: any): boolean {
    const cache = this.storage.get(instance);

    return cache.has(key);
  }

  public get<V>(key: K, instance: any): V {
    const cache = this.storage.get(instance);

    return cache.get(key);
  }

}
