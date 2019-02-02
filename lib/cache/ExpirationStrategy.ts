import { StorageType } from './StorageType';
import { MemoryStorage } from './MemoryStorage';

export class ExpirationStrategy<K> {

  private readonly expirations = new MemoryStorage<K, NodeJS.Timeout>();

  constructor(
    private readonly storage: StorageType<K, unknown>,
    private readonly expiration: 'absolute' | 'sliding',
    private readonly timeout: number,
  ) { }

  public add(key: K): void {
    this.addKey(key);
  }

  public update(key: K): void {
    if (this.expiration !== 'sliding') {
      return;
    }

    this.deleteKey(key);
    this.addKey(key);
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
