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
    const patternType = Array.isArray(this.waitPattern)
      ? 'array'
      : typeof this.waitPattern;

    switch (patternType) {
      case 'number':
        return this.waitPattern as number;
      case 'array':
        const values = this.waitPattern as number[];
        const count = values.length;
        return index > count ? values[count - 1] : values[index];
      case 'function':
        return (this.waitPattern as Function)(index);
      default:
        throw new Error(`Option ${patternType} is not supported for 'waitPattern'.`);
    }
  }
}
