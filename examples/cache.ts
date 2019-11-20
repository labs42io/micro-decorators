import { cache } from '../lib/cache/';

class Service {

  @cache(1000, { scope: 'class' })
  public asyncMethod(n: number): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(n ** 2), 10);
    });
  }

}

const service = new Service();

service.asyncMethod(3).then(res => console.log(res)); // no cache
service.asyncMethod(3).then(res => console.log(res)); // from cache
service.asyncMethod(4).then(res => console.log(res)); // no cache because another argument
