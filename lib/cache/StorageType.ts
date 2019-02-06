export interface StorageType<K> {
  set<V>(key: K, value: V): void;
  get<V>(key: K): V;
  has(key: K): boolean;
  delete(key: K): void;
}
