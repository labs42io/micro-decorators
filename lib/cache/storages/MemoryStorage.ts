import { Storage } from './Storage';

export class MemoryStorage implements Storage {

  private readonly storage = new Map<string, any>();

  constructor(private readonly limit?: number) { }

  public set<V>(key: string, value: V): Storage {
    if (typeof this.limit === 'number' && this.storage.size >= this.limit) {
      return this;
    }

    this.storage.set(key, value);
    return this;
  }

  public get<V>(key: string): V {
    return this.storage.get(key);
  }

  public has(key: string): boolean {
    return this.storage.has(key);
  }

  public delete(key: string): Storage {
    this.storage.delete(key);

    return this;
  }

}
