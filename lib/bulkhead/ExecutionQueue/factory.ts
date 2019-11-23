import { Factory } from '../../interfaces/factory';
import { ExecutionQueue } from './ExecutionQueue';

export class ExecutionQueueFactory<T = any> implements Factory<ExecutionQueue<T>> {

  constructor(
    private readonly limit: number,
  ) { }

  public create(): ExecutionQueue<T> {
    return new ExecutionQueue(this.limit);
  }

}
