import { cache } from '../lib/cache/';

class Service {
  @cache(1000, { scope: 'class' })
  public f(n: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(n ** 2), 10);
    });
  }

  @cache(1000, { scope: 'class' })
  public g(n: number): number {
    return n ** 2;
  }
}

const s = new Service();
s.f(4).then(res => console.log(res)); // first call => no cache
console.log(s.g(4)); // first call => no cache

new Service().f(3).then(res => console.log(res)); // first call => no cache
new Service().f(3).then(res => console.log(res)); // second call => from cache
new Service().f(4).then(res => console.log(res)); // second call => from cache
