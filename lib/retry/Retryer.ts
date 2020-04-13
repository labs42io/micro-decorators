import { raiseStrategy } from '../utils';
import { DEFAULT_ERROR, DEFAULT_OPTIONS, RetryOptions } from './RetryOptions';
import { WaitStrategy } from './WaitStrategy';

export class Retryer {
  private attempts: number = 0;
  private readonly retryOptions: RetryOptions = { ...DEFAULT_OPTIONS, ...this.options };

  constructor(
    private readonly options: RetryOptions,
    private readonly method: any,
    private readonly instance: any,
    private readonly retryCount: number,
  ) {
    this.attempts = (!this.retryCount || this.retryCount < 0) ? 0 : this.retryCount;
  }

  public getResponse(): any | Promise<any> {
    try {
      const response = this.method();
      const isPromiseLike = response && typeof response.then === 'function';

      return isPromiseLike ? this.getAsyncResponse(response) : response;
    } catch (err) {
      const isFiltered = this.retryOptions.errorFilter.bind(this.instance)(err);

      return isFiltered ? this.retryGetSyncResponse() : this.error();
    }
  }

  private retryGetSyncResponse(): any {
    for (let index = 0; index < this.attempts; index += 1) {
      try {
        return this.method();
      } catch (err) {
        const filteredError = this.retryOptions.errorFilter.bind(this.instance)(err);

        if (!filteredError) {
          return this.error();
        }
      }
    }

    return this.error();
  }

  private async getAsyncResponse(asyncResponse: any): Promise<any> {
    for (let index = 0; index <= this.attempts; index += 1) {
      await this.waitBeforeResponse(index);

      try {
        return index === 0 ? await asyncResponse : await this.method();
      } catch (err) {
        const filteredError = this.retryOptions.errorFilter.bind(this.instance)(err);

        if (!filteredError) {
          return this.error();
        }
      }
    }

    return this.error();
  }

  private async waitBeforeResponse(attemptIndex: number): Promise<void> {
    if (attemptIndex > 0) {
      const waitStrategy = new WaitStrategy(this.retryOptions.waitPattern);
      await waitStrategy.wait(attemptIndex - 1);
    }
  }

  private error() {
    const raise = raiseStrategy(this.retryOptions);

    return raise(new Error(DEFAULT_ERROR));
  }
}
