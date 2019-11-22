export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function repeat<T>(func: () => T, count: number): T[] {
  const results: T[] = [];

  for (let i = 0; i < count; i += 1) {
    results.push(func());
  }

  return results;
}
