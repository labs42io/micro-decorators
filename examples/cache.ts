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
console.log(s.f(4));
console.log(s.g(4));

new Service().f(3); // first call => no cached
new Service().f(3); // second call => cached
new Service().f(4); // first call with this arguments => no cached
