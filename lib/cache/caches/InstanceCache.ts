import { ClassType } from '../../interfaces/class';
import { Expiration } from '../expirations/Expiration';
import { HashService } from '../../utils/hash/hash';
import { Storage } from '../storages/Storage';
import { Cache } from './Cache';

export class InstanceCache<K = any> implements Cache<K> {

  private readonly instanceStorage = new WeakMap<ClassType, [Storage, Expiration]>();

  constructor(
    private readonly storage: () => Storage,
    private readonly expiration: () => Expiration,
    private readonly hash: HashService,
  ) { }

  public async set<V>(key: K, value: V, instance: ClassType): Promise<void> {
    const keyHash = this.hash.calculate(key);
    const [storage, expiration] = this.instanceData(instance);

    await storage.set(keyHash, value);
    expiration.add(keyHash, () => this.delete(keyHash, instance));
  }

  public async get<V>(key: K, instance: ClassType): Promise<V> {
    const keyHash = this.hash.calculate(key);
    const [storage, expiration] = this.instanceData(instance);

    expiration.add(keyHash, () => this.delete(keyHash, instance));
    return storage.get(keyHash);
  }

  private async delete(key: string, instance: ClassType): Promise<void> {
    const [storage] = this.instanceData(instance);

    await storage.delete(key);
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
