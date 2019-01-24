import { Throttler } from '../Throttler';

export class ClassScope {
  private readonly throttle;

  constructor(limit: number, interval: number) {
    this.throttle = new Throttler(limit, interval);
  }

  throttler() {
    return this.throttle;
  }
}
