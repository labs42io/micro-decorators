export interface Factory<T, Args extends any[] | never = never> {
  create(...args: Args): T;
}
