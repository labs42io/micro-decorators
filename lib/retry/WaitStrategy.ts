import { WaitPattern } from './RetryOptions';

export function waitStrategy(attemptIndex: number, waitPattern: WaitPattern): Promise<void> {
  const patternType = Array.isArray(waitPattern)
    ? 'array'
    : typeof waitPattern;

  switch (patternType) {
    case 'number':
      return wait(waitPattern as number);
    case 'array':
      const attemptValues = waitPattern as number[];
      const shouldWaitValue = attemptIndex > attemptValues.length
        ? attemptValues[attemptValues.length - 1]
        : attemptValues[attemptIndex];

      return wait(shouldWaitValue);
    case 'function':
      return wait((waitPattern as Function)(attemptIndex));
    default:
      throw new Error(`Option ${patternType} is not supported for 'waitPattern'.`);
  }
}

function wait(timeout: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
