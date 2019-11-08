export interface Storage {
  set<V>(key: string, value: V): Storage;
  get<V>(key: string): V;
  has(key: string): boolean;
  delete(key: string): Storage;
}
