export interface Storage {
  set<V>(key: string, value: V): Promise<this>;
  get<V>(key: string): Promise<V>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<this>;
}
