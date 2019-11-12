import { Expiration } from './Expiration';

export class AbsoluteExpiration implements Expiration {

  private readonly expirations = new Set<string>();

  constructor(
    private readonly timeout: number,
  ) { }

  public add(key: string, clear: (key: string) => unknown): void {
    if (this.expirations.has(key)) {
      return;
    }

    this.expirations.add(key);
    setTimeout(this.clear(key, clear), this.timeout);
  }

  private clear(key: string, clear: (key: string) => unknown): () => void {
    return () => {
      this.expirations.delete(key);
      clear(key);
    };
  }

}
