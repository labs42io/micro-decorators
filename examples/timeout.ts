import { timeout } from '../lib';

class Test {
  @timeout(10)
  do(): Promise<number> {
    return new Promise((res, rej) => setTimeout(res, 1000));
  }
}

console.log('Hello world.');

const t = new Test().do().catch(err => console.log('failed'));
