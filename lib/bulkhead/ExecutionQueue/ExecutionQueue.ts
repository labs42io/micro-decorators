import { ExecutionMetaData } from '../types';

export class ExecutionQueue<T = any> {

  private readonly queue: ExecutionMetaData<T>[] = [];

  constructor(
    private readonly limit: number = Infinity,
  ) { }

  public store(data: ExecutionMetaData<T>): this {
    this.checkLimit();

    this.queue.push(data);

    return this;
  }

  public next(): ExecutionMetaData<T> {
    return this.queue.shift();
  }

  private checkLimit() {
    if (this.queue.length >= this.limit) {
      throw new Error('@bulkhead execution queue limit reached.');
    }
  }

}
