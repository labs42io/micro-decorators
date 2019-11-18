import { Policy } from '../Policy/Policy';

export class CircuitState {

  private state: 'open' | 'close' | 'half-open' = 'open';
  private timers = new Set<number>();

  constructor(
    private readonly timeout: number,
    private readonly interval: number,
    private readonly errorsFilter: (error: Error) => boolean,
    private readonly policy: Policy,
    private readonly clearCallback: () => unknown,
  ) { }

  public allowExecution(): boolean {
    return this.state !== 'close';
  }

  public register(error?: Error): this {
    const isError = error && this.errorsFilter(error);
    const type = isError ? 'error' : 'success';

    this.exitHalfOpenState(isError);

    this.policy.registerCall(type);
    this.registerCall(type);

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

  private registerCall(type: 'success' | 'error'): void {
    if (typeof this.interval !== 'number') {
      return;
    }

    const timer = setTimeout(
      () => {
        this.policy.deleteCallData(type);

        if (this.state === 'open' && !this.policy.allowExecution()) {
          this.close();
        }

        this.removeTimerData(timer as any);
      },
      this.interval,
    );

    this.timers.add(timer as any);
  }

  private open() {
    this.state = 'open';
    this.policy.reset();

    this.timers.forEach(timer => this.removeTimerData(timer));
  }

  private close() {
    this.state = 'close';

    setTimeout(() => this.state = 'half-open', this.timeout);
  }

  private removeTimerData(timer: number) {
    clearTimeout(timer as any);
    this.timers.delete(timer as any);

    if (this.timers.size === 0) {
      this.clearCallback();
    }
  }

}
