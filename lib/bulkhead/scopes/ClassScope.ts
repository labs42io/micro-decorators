import { Bulkhead } from '../Bulkhead';

export class ClassScope {
  private readonly limiter;

  constructor(
    private readonly threshold: number,
    private readonly size: number,
  ) {
    this.limiter = new Bulkhead(threshold, size);
  }

  bulkhead() {
    return this.limiter;
  }
}
