export interface Expiration {
  add(key: string, clear: () => any): void;
}
