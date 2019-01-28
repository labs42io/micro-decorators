import { Bulkhead } from '../Bulkhead';

export class ClassScope {
  private readonly bulkheadInstance;

  constructor(size: number) {
    this.bulkheadInstance = new Bulkhead(size);
  }

  bulkhead() {
    return this.bulkheadInstance;
  }
}
