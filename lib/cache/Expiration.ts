export interface Expiration<K> {
  add(key: K): void;
  touch(key: K): void;
}
