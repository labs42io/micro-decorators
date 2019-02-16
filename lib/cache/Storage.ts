export interface Storage<K> {
  set<V>(key: K, value: V): Storage<K>;
  get<V>(key: K): V;
  has(key: K): boolean;
  delete(key: K): Storage<K>;
}
