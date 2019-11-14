export function isPromise(data: any): data is Promise<unknown> {
  return data
    && data.then && typeof data.then === 'function'
    && data.catch && typeof data.catch === 'function';
}
