import { raiseStrategy } from '../utils';
import { DEFAULT_ERROR, DEFAULT_OPTIONS, RetryOptions } from './RetryOptions';
import { WaitStrategy } from './WaitStrategy';

export class Retryer {
  private attempts: number = 0;
  private retryOptions: RetryOptions = DEFAULT_OPTIONS;

  constructor(
    private readonly options: RetryOptions,
    private readonly method: any,
    private readonly instance: any,
    private readonly retryCount: number,
  ) {
    this.attempts = (!retryCount || retryCount < 0) ? 0 : retryCount;
    this.retryOptions = { ...this.retryOptions, ...options };
  }

  public getResponse(): any | Promise<any> {
    try {
      const response = this.method();
      const isPromiseLike = response && typeof response.then === 'function';

      return isPromiseLike ? this.getAsyncResponse(response) : response;
    } catch (err) {
      const isFiltered = this.retryOptions.errorFilter.bind(this.instance)(err);

      return !isFiltered ? this.error() : this.retryGetSyncResponse();
    }
  }

  private retryGetSyncResponse(): any {
    for (let index = 0; index < this.attempts; index += 1) {
      try {
        return this.method();
      } catch (err) {
        const isFiltered = this.retryOptions.errorFilter.bind(this.instance)(err);

        if (!isFiltered) {
          return this.error();
        }
      }
    }

    return this.error();
  }

  // tslint:disable-next-line:max-line-length
  private async getAsyncResponse(asyncResponse: any): Promise<any> {
    for (let index = 0; index <= this.attempts; index += 1) {
      if (index > 0) {
        const waitStrategy = new WaitStrategy(this.retryOptions.waitPattern);
        await waitStrategy.wait(index - 1);
      }

      try {
        const response = index === 0 ? await asyncResponse : await this.method();

        return response;
      } catch (err) {
        const isFiltered = this.retryOptions.errorFilter.bind(this.instance)(err);

        if (!isFiltered) {
          return this.error();
        }
      }
    }

    return this.error();
  }

  private error() {
    const raise = raiseStrategy(this.retryOptions);
    return raise(new Error(DEFAULT_ERROR));
  }
}
