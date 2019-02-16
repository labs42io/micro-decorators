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

export async function executionTime(func: () => Promise<any>): Promise<number> {
  const begin = Date.now();
  await func();
  return Date.now() - begin;
}
