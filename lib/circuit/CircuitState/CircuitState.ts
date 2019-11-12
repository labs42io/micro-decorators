import { Policy } from '../Policy/Policy';

export class CircuitState {

  private state: 'open' | 'close' | 'half-open' = 'open';
  private removeExecutionsTimers: number[] = [];

  constructor(
    private readonly timeout: number,
    private readonly interval: number,
    private readonly errorsFilter: (error: Error) => boolean,
    private readonly policy: Policy,
  ) { }

  public allowExecution(): boolean {
    return this.state !== 'close';
  }

  public register(error?: Error): this {
    const isError = error && this.errorsFilter(error);
    const type = isError ? 'error' : 'success';

    if (this.state === 'half-open') {
      isError ? this.close() : this.open();
    }

    this.policy.addExecution(type);
    this.removeExecution(type);

    if (!this.policy.allowExecution()) {
      this.close();
    }

    return this;
  }

  private removeExecution(type: 'success' | 'error'): void {
    if (typeof this.interval !== 'number') {
      return;
    }

    const timer = setTimeout(
      () => {
        this.policy.removeExecution(type);

        if (this.state === 'open' && !this.policy.allowExecution()) {
          this.close();
        }
      },
      this.interval,
    );

    this.removeExecutionsTimers.push(timer as any);
  }

  private open() {
    this.state = 'open';
    this.policy.reset();

    this.removeExecutionsTimers.forEach(timer => clearTimeout(timer as any));
    this.removeExecutionsTimers = [];
  }

  private close() {
    this.state = 'close';

    setTimeout(() => this.state = 'half-open', this.timeout);
  }

}
