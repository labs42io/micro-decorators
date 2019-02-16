export interface Cache<K> {
  set<V>(key: K, value: V, instance: any): void;
  has(key: K, instance: any): boolean;
  get<V>(key: K, instance: any): V;
}
