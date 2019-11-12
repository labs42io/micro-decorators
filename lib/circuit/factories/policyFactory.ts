import { ErrorsPolicy } from '../Policy/ErrorsPolicy';
import { Policy } from '../Policy/Policy';
import { RatePolicy } from '../Policy/RatePolicy';

const factories: ReadonlyMap<'errors' | 'rate', (threshold: number) => Policy> =
  new Map<'errors' | 'rate', (threshold: number) => Policy>()
    .set('errors', threshold => new ErrorsPolicy(threshold))
    .set('rate', threshold => new RatePolicy(threshold));

export function policyFactory(threshold: number, type: 'errors' | 'rate'): Policy {
  const factory = factories.get(type);

  if (!factory) {
    throw new Error(`@circuit unsuported policy type: ${type}`);
  }

  return factory(threshold);
}
