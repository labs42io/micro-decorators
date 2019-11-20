export interface Factory<T, A extends any[] | never = any[]> {
  create(...args: A): T;
}
