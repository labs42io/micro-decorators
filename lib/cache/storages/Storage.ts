export interface Storage {
  set<V>(key: string, value: V): Promise<void>;
  get<V>(key: string): Promise<V>;
  delete(key: string): Promise<void>;
}
