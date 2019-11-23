export interface Factory<T, Args extends any[]= any[] | never> {
  create(...args: Args): T;
}
