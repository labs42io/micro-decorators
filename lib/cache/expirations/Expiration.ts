export interface Expiration {
  add(key: string, clear: (key: string) => unknown): void;
}
