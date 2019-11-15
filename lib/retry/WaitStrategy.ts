import { WaitPattern } from './RetryOptions';

export class WaitStrategy {

  constructor(
    private readonly waitPattern: WaitPattern,
  ) { }

  public wait(index: number): Promise<void> {
    if (!this.waitPattern) {
      return Promise.resolve();
    }

    const timeout = this.getTimeout(index) || 0;
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  private getTimeout(index: number): number {
    if (Array.isArray(this.waitPattern)) {
      const values = this.waitPattern as number[];
      const count = values.length;
      return index > count ? values[count - 1] : values[index];
    }

    if (typeof this.waitPattern === 'number') {
      return this.waitPattern as number;
    }

    if (typeof this.waitPattern === 'function') {
      return (this.waitPattern as Function)(index);
    }

    throw new Error(`Option ${typeof this.waitPattern} is not supported for 'waitPattern'.`);
  }
}
