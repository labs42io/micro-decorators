import { Expiration } from './Expiration';

export class AbsoluteExpiration implements Expiration {

  private readonly expirations = new Set<string>();

  constructor(
    private readonly timeout: number,
  ) { }

  public add(key: string, clearCallback: (key: string) => unknown): void {
    if (this.expirations.has(key)) {
      return;
    }

    this.expirations.add(key);
    setTimeout(() => this.clear(key, clearCallback), this.timeout);
  }

  private clear(key: string, clearCallback: (key: string) => unknown): void {
    this.expirations.delete(key);
    clearCallback(key);
  }

}
