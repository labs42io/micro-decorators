import { Bulkhead } from '../Bulkhead';

export class ClassScope {
  private readonly bulkheadInstance;

  constructor(
    private readonly threshold: number,
    private readonly size: number,
  ) {
    this.bulkheadInstance = new Bulkhead(threshold, size);
  }

  bulkhead() {
    return this.bulkheadInstance;
  }
}
