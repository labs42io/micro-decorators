import { Expiration } from './Expiration';

export class SlidingExpiration implements Expiration {

  private readonly expirations = new Map<string, number>();

  constructor(
    private readonly timeout: number,
  ) { }

  public add(key: string, clear: (key: string) => unknown): void {
    this.expirations.has(key) ? this.update(key, clear) : this.addKey(key, clear);
  }

  private addKey(key: string, clear: (key: string) => unknown): void {
    const timeoutId = setTimeout(
      () => {
        this.expirations.delete(key);
        clear(key);
      },
      this.timeout,
    );

    this.expirations.set(key, timeoutId as any);
  }

  private update(key: string, clear: (key: string) => unknown): void {
    const timeoutId = this.expirations.get(key);
    clearTimeout(timeoutId as any);

    this.expirations.delete(key);
    this.addKey(key, clear);
  }

}
