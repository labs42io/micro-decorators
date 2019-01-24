import * as hash from 'object-hash';
import { Throttler } from '../Throttler';

export class ArgsHashScope {
  private readonly map: Map<string, [Throttler, any]> = new Map();

  constructor(
    private readonly limit: number,
    private readonly interval: number) {
  }

  throttler(instance: any, args: any) {
    const key = hash(args);
    const value = this.map.get(key);

    return value ? this.update(key, value) : this.create(key);
  }

  private update(key: string, value: [Throttler, any]) {
    // Clear previous timeout and create a new one
    // with extended expiration.
    clearTimeout(value[1]);
    this.map.set(key, [value[0], this.remember(key)]);

    return value[0];
  }

  private create(key: string) {
    const throttle = new Throttler(this.limit, this.interval);

    // Keep the throttler in map only for `interval` period
    // to avoid memory leaks.
    this.map.set(key, [throttle, this.remember(key)]);

    return throttle;
  }

  private remember(key: string) {
    return setTimeout(() => this.map.delete(key), this.interval + 100);
  }
}
