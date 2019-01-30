export interface StorageType<K, V> {
  set(key: K, value: V): void;
  get(key: K): V;
  has(key: K): boolean;
  delete(key: K): void;
}
