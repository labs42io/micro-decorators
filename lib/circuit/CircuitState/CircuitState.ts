import { Policy } from '../Policy/Policy';

export class CircuitState {

  private state: 'open' | 'close' | 'half-open' = 'open';
  private timers: number[] = [];

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

    this.exitHalfOpenState(isError);

    this.policy.registerCall(type);
    this.removeExecution(type);

    if (!this.policy.allowExecution()) {
      this.close();
    }

    return this;
  }

  private exitHalfOpenState(isError: boolean) {
    if (this.state !== 'half-open') {
      return;
    }

    if (isError) {
      this.close();
    } else {
      this.open();
    }
  }

  private removeExecution(type: 'success' | 'error'): void {
    if (typeof this.interval !== 'number') {
      return;
    }

    const timer = setTimeout(
      () => {
        this.policy.deleteCallData(type);

        if (this.state === 'open' && !this.policy.allowExecution()) {
          this.close();
        }
      },
      this.interval,
    );

    this.timers.push(timer as any);
  }

  private open() {
    this.state = 'open';
    this.policy.reset();

    this.timers.forEach(timer => clearTimeout(timer as any));
    this.timers = [];
  }

  private close() {
    this.state = 'close';

    setTimeout(() => this.state = 'half-open', this.timeout);
  }

}
