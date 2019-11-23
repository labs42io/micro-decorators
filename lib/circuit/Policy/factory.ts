import { Factory } from '../../interfaces/factory';
import { Policy } from './Policy';
import { ErrorsPolicy } from './ErrorsPolicy';
import { RatePolicy } from './RatePolicy';

export class PolicyFactory implements Factory<Policy, ['errors' | 'rate']> {

  constructor(
    private readonly threshold: number,
  ) { }

  public create(policy: 'errors' | 'rate'): Policy {
    switch (policy) {
      case 'errors':
        return new ErrorsPolicy(this.threshold);

      case 'rate':
        return new RatePolicy(this.threshold);

      default:
        throw new Error(`@circuit unsuported policy type: ${policy}`);
    }
  }

}
