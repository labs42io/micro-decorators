import * as hash from 'object-hash';

import { StorageType } from './StorageType';

export class MemoryStorage<K, V> implements StorageType<K, V> {

  private readonly storage = new Map<string, V>();

  constructor(private readonly limit?: number) { }

  public set(key: K, value: V): void {
    if (this.limit && this.storage.size < this.limit) {
      return;
    }

    this.storage.set(hash(key), value);
  }

  public get(key: K): V {
    return this.storage.get(hash(key));
  }

  public has(key: K): boolean {
    return this.storage.has(hash(key));
  }

  public delete(key: K): void {
    this.storage.delete(hash(key));
  }

}
