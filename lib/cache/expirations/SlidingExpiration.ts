import { Expiration } from './Expiration';

export class SlidingExpiration implements Expiration {

  private readonly expirations = new Map<string, number>();

  constructor(
    private readonly timeout: number,
  ) { }

  public add(key: string, clearCallback: (key: string) => unknown): void {
    this.expirations.has(key) ? this.update(key, clearCallback) : this.addKey(key, clearCallback);
  }

  private addKey(key: string, clearCallback: (key: string) => unknown): void {
    const timeoutId = setTimeout(
      () => {
        this.expirations.delete(key);
        clearCallback(key);
      },
      this.timeout,
    );

    this.expirations.set(key, timeoutId as any);
  }

  private update(key: string, clearCallback: (key: string) => unknown): void {
    const timeoutId = this.expirations.get(key);
    clearTimeout(timeoutId as any);

    this.expirations.delete(key);
    this.addKey(key, clearCallback);
  }

}
