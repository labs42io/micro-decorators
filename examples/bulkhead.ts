import { bulkhead } from '../lib';

class Service {

  @bulkhead(2, { size: 1 })
  public async get(value: number) {
    return new Promise(resolve => setTimeout(
      () => resolve(value + 1),
      100,
    ));
  }

}

const instance = new Service();

instance.get(1) // start execution immediately
  .then(result => console.log(`call 1 result: ${result}`));
instance.get(2) // start execution immediately
  .then(result => console.log(`call 2 result: ${result}`));

instance.get(3) // start execution after one of first 2 executions ends
  .then(result => console.log(`call 3 result: ${result}`));

instance.get(4) // throws because are executed to much calls and queue limit is reached
  .catch(() => console.log('call 4 fails'));
