import { Policy } from './Policy';

export class ErrorsPolicy implements Policy {

  private errors: number = 0;

  constructor(
    private readonly threshold: number,
  ) { }

  public registerCall(type: 'success' | 'error'): this {
    this.errors += type === 'error' ? 1 : 0;

    return this;
  }

  public deleteCallData(type: 'success' | 'error'): this {
    this.errors -= type === 'error' ? 1 : 0;

    return this;
  }

  public reset(): this {
    this.errors = 0;

    return this;
  }

  public allowExecution(): boolean {
    return this.errors < this.threshold;
  }

}
