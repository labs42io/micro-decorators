import { retry } from '../lib';

class Service {
  @retry(3)
  do(): Promise<number> {
    return new Promise((res, rej) => {
      setTimeout(res, 1000);
    });
  }
}

const t = new Service().do().catch(err => console.log(err.message));
