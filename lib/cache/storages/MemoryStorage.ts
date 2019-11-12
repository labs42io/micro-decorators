import { Storage } from './Storage';

export class MemoryStorage implements Storage {

  private readonly storage = new Map<string, any>();
  private keys: string[];
  private readonly hasLimit: boolean;

  constructor(private readonly limit?: number) {
    this.hasLimit = typeof this.limit === 'number';
    if (this.hasLimit) {
      this.keys = [];
    }
  }

  public set<V>(key: string, value: V): Promise<void> {
    this.checkSize(key);

    this.storage.set(key, value);

    return Promise.resolve();
  }

  public get<V>(key: string): Promise<V> {
    return Promise.resolve(this.storage.get(key));
  }

  public delete(key: string = this.keys[0]): Promise<void> {
    this.storage.delete(key);

    if (this.hasLimit) {
      this.keys = this.keys.filter(value => value !== key);
    }

    return Promise.resolve();
  }

  private checkSize(key: string): void {
    if (!this.hasLimit) {
      return;
    }

    if (this.storage.size >= this.limit) {
      this.delete();
    }

    this.keys.push(key);
  }

}
