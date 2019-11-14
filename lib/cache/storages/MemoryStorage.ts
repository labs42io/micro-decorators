import { Storage } from './Storage';

export class MemoryStorage implements Storage {

  private readonly storage = new Map<string, any>();

  constructor(private readonly limit?: number) { }

  public async set<V>(key: string, value: V): Promise<this> {
    this.checkSize();

    this.storage.set(key, value);

    return this;
  }

  public async get<V>(key: string): Promise<V> {
    return this.storage.get(key);
  }

  public async has(key: string): Promise<boolean> {
    return this.storage.has(key);
  }

  public async delete(key: string): Promise<this> {
    this.storage.delete(key);

    return this;
  }

  private checkSize(): void {
    if (typeof this.limit === 'number' && this.storage.size >= this.limit) {
      this.delete(this.storage.keys().next().value);
    }
  }

}
