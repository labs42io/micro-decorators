export interface Expiration {
  add(key: string, clearCallback: (key: string) => unknown): void;
}
