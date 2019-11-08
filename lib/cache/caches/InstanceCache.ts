import { ClassType } from '../../interfaces/class';
import { Expiration } from '../expirations/Expiration';
import { HashService } from '../hash/hash';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class InstanceCache<K = any> implements Cache<K> {

  private readonly instanceStorage = new WeakMap<ClassType, [Storage, Expiration]>();

  constructor(
    private readonly storage: () => Storage,
    private readonly expiration: () => Expiration,
    private readonly hash: HashService,
  ) { }

  public set<V>(key: K, value: V, instance: ClassType): this {
    const keyHash = this.hash.hash(key);
    const [storage, expiration] = this.instanceData(instance);

    storage.set(keyHash, value);
    expiration.add(keyHash, () => this.delete(keyHash, instance));

    return this;
  }

  public get<V>(key: K, instance: ClassType): V {
    const keyHash = this.hash.hash(key);
    const [storage, expiration] = this.instanceData(instance);

    expiration.add(keyHash, () => this.delete(keyHash, instance));
    return storage.get(keyHash);
  }

  private delete(key: string, instance: ClassType): this {
    const [storage] = this.instanceData(instance);

    storage.delete(key);

    return this;
  }

  private instanceData(instance: ClassType): [Storage, Expiration] {
    if (!this.instanceStorage.has(instance)) {
      const storage = this.storage();
      const expiration = this.expiration();
      this.instanceStorage.set(instance, [storage, expiration]);
    }

    return this.instanceStorage.get(instance);
  }

}
