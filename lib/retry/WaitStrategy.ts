import { WaitPattern } from './RetryOptions';

export class WaitStrategy {

  constructor(
    private readonly waitPattern: WaitPattern,
  ) { }

  public wait(index: number, instance: any): Promise<void> {
    if (!this.waitPattern) {
      return Promise.resolve();
    }

    const timeout = this.getTimeout(index, instance) || 0;
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  private getTimeout(index: number, instance: any): number {
    const patternType = Array.isArray(this.waitPattern)
      ? 'array'
      : typeof this.waitPattern;

    switch (patternType) {
      case 'number':
        return this.waitPattern as number;
      case 'array':
        const values = this.waitPattern as number[];
        const timeout = index > values.length
          ? values[values.length - 1]
          : values[index];

        return timeout;
      case 'function':
        return (this.waitPattern as Function)(index);
      default:
        throw new Error(`Option ${patternType} is not supported for 'waitPattern'.`);
    }
  }
}
