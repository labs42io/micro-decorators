export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function repeat(func: () => void, count: number) {
  const results = [];

  for (let i = 0; i < count; i += 1) {
    results.push(func());
  }

  return results;
}

export type SpyObj<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
  ? ChaiSpies.SpyFunc0Proxy<ReturnType<T[K]>>
  : T[K];
};
