import { cache } from '../lib/cache/';

class Service {

  @cache(1000, { scope: 'class' })
  public method(n: number): number {
    return n ** 2;
  }

  @cache(1000, { scope: 'class' })
  public asyncMethod(n: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(n ** 2), 10);
    });
  }

}

const s = new Service();
s.asyncMethod(4).then(res => console.log(res)); // first call => no cache
console.log(s.method(4)); // first call => no cache

new Service().asyncMethod(3).then(res => console.log(res)); // first call => no cache
new Service().asyncMethod(3).then(res => console.log(res)); // second call => from cache
new Service().asyncMethod(4).then(res => console.log(res)); // second call => from cache
