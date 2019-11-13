import { Storage } from './Storage';

export class MemoryStorage implements Storage {

  private readonly storage = new Map<string, any>();

  private readonly hasLimit: boolean;
  private readonly keysStorage: Set<string>;

  constructor(private readonly limit?: number) {
    this.hasLimit = typeof this.limit === 'number';
    if (this.hasLimit) {
      this.keysStorage = new Set<string>();
    }
  }

  public async set<V>(key: string, value: V): Promise<this> {
    this.checkSize(key);

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

    if (this.hasLimit) {
      this.keysStorage.delete(key);
    }

    return this;
  }

  private checkSize(key: string): void {
    if (!this.hasLimit) {
      return;
    }

    if (this.storage.size >= this.limit) {
      this.delete(this.keysStorage.keys().next().value);
    }

    this.keysStorage.add(key);
  }

}
