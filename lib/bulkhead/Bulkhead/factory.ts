import { Factory } from '../../interfaces/factory';
import { ExecutionQueueFactory } from '../ExecutionQueue/factory';
import { Bulkhead } from './Bulkhead';

export class BulkheadFactory<T = any> implements Factory<Bulkhead<T>> {

  constructor(
    private readonly threshold: number,
    private readonly executionQueueFactory: ExecutionQueueFactory<T>,
  ) { }

  public create(): Bulkhead<T> {
    const executionQueue = this.executionQueueFactory.create();

    return new Bulkhead(this.threshold, executionQueue);
  }

}
