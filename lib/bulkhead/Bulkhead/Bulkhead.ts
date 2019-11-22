import { ExecutionQueue } from '../ExecutionQueue/ExecutionQueue';

export class Bulkhead<T = any> {

  private inExecution: number = 0;

  constructor(
    private readonly threshold: number,
    private readonly executionQueue: ExecutionQueue<T>,
  ) { }

  public async run(method: (...args: any[]) => Promise<T>, args: any[]): Promise<T> {
    if (this.inExecution < this.threshold) {
      return this.execute(method, args);
    }

    return this.addToQueue(method, args);
  }

  private async execute(method: (...args: any[]) => Promise<T>, args: any[]) {
    this.inExecution += 1;

    const result = method(...args);

    const afterExecution = async () => {
      this.inExecution -= 1;
      this.callNext();
    };

    result.then(afterExecution, afterExecution);

    return result;
  }

  private async addToQueue(method: (...args: any[]) => Promise<T>, args: any[]) {
    return new Promise<T>(
      (resolve, reject) => this.executionQueue.store({ method, args, resolve, reject }),
    );
  }

  private async callNext() {
    const next = this.executionQueue.next();
    if (!next) {
      return;
    }

    const { method, args, resolve, reject } = next;

    try {
      const result = await this.execute(method, args);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }

}
