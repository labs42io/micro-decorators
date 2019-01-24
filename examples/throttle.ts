import { throttle } from '../lib';

class Service {
  @throttle(3, { interval: 'second' })
  get() {
    return 42;
  }
}

const service = new Service();

service.get();
service.get();
service.get();

// Only 3 executions per second are allowed.
try { service.get(); }
catch (err) { console.log(err.message); }
