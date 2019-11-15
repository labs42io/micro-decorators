export function isPromiseLike(data: any): data is PromiseLike<unknown> {
  return data && data.then && typeof data.then === 'function';
}
