import { Expiration } from './Expiration';

export class SlidingExpiration implements Expiration {

  private readonly expirations = new Map<string, [number, () => any]>();

  constructor(
    private readonly timeout: number,
  ) { }

  public add(key: string, clear: () => any): void {
    this.expirations.has(key) ? this.update(key, clear) : this.addKey(key, clear);
  }

  private addKey(key: string, clear: () => any): void {
    const timeoutId = setTimeout(
      () => {
        clear();
        this.expirations.delete(key);
      },
      this.timeout,
    );

    this.expirations.set(key, [timeoutId as any, clear]);
  }

  private update(key: string, clear: () => any): void {
    const [timeoutId] = this.expirations.get(key);
    clearTimeout(timeoutId as any);

    this.expirations.delete(key);
    this.addKey(key, clear);
  }

}
