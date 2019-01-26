type Decorator = (target: any, key: any, descriptor: PropertyDescriptor) => void;

/**
 * Combines a list of decorators.
 * @param decorators
 */
export function policy(...decorators: Decorator[]): Decorator {
  throw new Error('Not implemented.');
}
