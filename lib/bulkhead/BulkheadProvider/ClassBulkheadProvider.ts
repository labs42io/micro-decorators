import { Bulkhead } from '../Bulkhead/Bulkhead';
import { BulkheadFactory } from '../Bulkhead/factory';
import { BulkheadProvider } from './BulkheadProvider';

export class ClassBulkheadProvider<T = any> implements BulkheadProvider<T> {

  private bulkhead: Bulkhead<T> = null;

  constructor(
    private readonly bulkheadFactory: BulkheadFactory<T>,
  ) { }

  public get(): Bulkhead<T> {
    if (!this.bulkhead) {
      this.bulkhead = this.bulkheadFactory.create();
    }

    return this.bulkhead;
  }

}
