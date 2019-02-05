import { DEFAULT_SIZE } from './BulkheadOptions';

export class Bulkhead {

  private inFlight: number = 0;
  private queue: any[] = [];

  constructor(
    private readonly threshold: number,
    private readonly size: number = DEFAULT_SIZE,
  ) { }

  public pass(): boolean {
    return !this.size || this.queue.length < this.size;
  }

  public run(scope: any, method: () => Promise<any>, args: any) {
    if (this.inFlight < this.threshold) {
      return this.runInstant(scope, method, args);
    }

    return this.addToQueue(scope, method, args);
  }

  private async runInstant(scope, method: () => Promise<any>, args: any) {
    let response;
    this.inFlight += 1;

    try {
      response = await method.apply(scope, args);
    } catch (e) { }

    this.inFlight -= 1;
    this.callNext();

    return response;
  }

  private addToQueue(scope: any, method: () => Promise<any>, args: any) {
    const promise = new Promise(resolve => resolve(this.runInstant(scope, method, args)));

    this.queue.push(promise);
    return promise;
  }

  private callNext() {
    if (!this.queue.length) {
      return;
    }

    const promise = this.queue.shift();
    return promise;
  }
}
