export class Bulkhead {

  private inExecution: number = 0;
  private queue: any[] = [];

  private count = 1;

  constructor(
    private readonly threshold: number,
    private readonly size: number,
  ) { }

  public pass(): boolean {
    return this.size === undefined || this.queue.length < this.size;
  }

  public run(scope: any, method: () => Promise<any>, args: any) {
    if (this.inExecution < this.threshold) {
      return this.execute(scope, method, args);
    }

    return this.addToQueue(scope, method, args);
  }

  private async execute(scope, method: () => Promise<any>, args: any, resolve?) {
    let response;
    this.inExecution += 1;

    try {
      response = await method.apply(scope, args);
    } catch (e) {
      // throw e;
    } finally {

      this.inExecution -= 1;
      this.callNext();
    }

    return resolve ? resolve(response) : response;
  }

  private addToQueue(scope: any, method: () => Promise<any>, args: any) {
    return new Promise((resolve, reject) =>
      this.queue.push({ scope, method, args, resolve, reject }));
  }

  private callNext() {
    if (!this.queue.length) {
      return;
    }

    const promise = this.queue.shift();
    const { scope, method, args, resolve, reject } = promise;

    return this.execute(scope, method, args, resolve);
  }
}
