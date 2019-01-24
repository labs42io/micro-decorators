export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export function repeat(func: () => void, count: number) {
  const results = [];

  for (let i = 0; i < count; i++) {
    results.push(func());
  }

  return results;
}
