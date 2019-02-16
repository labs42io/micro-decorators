import { Expiration } from './Expiration';
import { MemoryStorage } from './MemoryStorage';
import { Storage } from './Storage';

export class AbsoluteExpiration<K> implements Expiration<K> {

  private readonly expirations = new MemoryStorage<K>();

  constructor(
    private readonly storage: Storage<K>,
    private readonly timeout: number,
  ) { }

  public add(key: K): void {
    this.addKey(key);
  }

  public touch(): void {
  }

  private addKey(key: K): void {
    const timeout = setTimeout(
      () => this.deleteKey(key),
      this.timeout,
    );
    this.expirations.set(key, timeout);
  }

  private deleteKey(key: K): void {
    this.expirations.delete(key);
    this.storage.delete(key);
  }

}
