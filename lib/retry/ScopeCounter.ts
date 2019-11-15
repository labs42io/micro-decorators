import { Counter } from './Counter';

export class ScopeCounter {
  private readonly map: WeakMap<any, Counter> = new WeakMap();

  public getCounter(instance): Counter {
    return this.map.get(instance) || this.createCounter(instance);
  }

  private createCounter(instance): Counter {
    const counter = new Counter();
    this.map.set(instance, counter);

    return counter;
  }
}
