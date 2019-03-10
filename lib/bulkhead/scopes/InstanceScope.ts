import { Bulkhead } from '../Bulkhead';

export class InstanceScope<T = any> {
  private readonly map: WeakMap<any, Bulkhead> = new WeakMap();

  constructor(
    private readonly threshold: number,
    private readonly size: number,
  ) { }

  bulkhead(instance: T) {
    return this.map.get(instance) || this.create(instance);
  }

  private create(instance: T) {
    const bulkhead = new Bulkhead(this.threshold, this.size);
    this.map.set(instance, bulkhead);

    return bulkhead;
  }
}
