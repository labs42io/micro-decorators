export function isPromise(data: any): data is Promise<unknown> {
  return data && data.then && data.catch;
}
