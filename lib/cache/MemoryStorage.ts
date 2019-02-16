import * as hash from 'object-hash';

import { Storage } from './Storage';

export class MemoryStorage<K> implements Storage<K> {

  private readonly storage = new Map<string, any>();

  constructor(private readonly limit?: number) { }

  public set<V>(key: K, value: V): Storage<K> {
    if (this.limit && this.storage.size < this.limit) {
      return this;
    }

    this.storage.set(hash(key), value);
    return this;
  }

  public get<V>(key: K): V {
    return this.storage.get(hash(key));
  }

  public has(key: K): boolean {
    return this.storage.has(hash(key));
  }

  public delete(key: K): Storage<K> {
    this.storage.delete(hash(key));

    return this;
  }

}
