import { Throttler } from '../Throttler';

export class InstanceScope {
  // Use a weak map so that original instances can be garbage collected.
  // Once an instance is garbage collected, the reference to throttle is removed.
  private readonly map: WeakMap<any, Throttler> = new WeakMap();

  constructor(
    private readonly limit: number,
    private readonly interval: number) {
  }

  throttler(instance: any) {
    return this.map.get(instance) || this.create(instance);
  }

  private create(instance: any) {
    const throttle = new Throttler(this.limit, this.interval);
    this.map.set(instance, throttle);

    return throttle;
  }
}
