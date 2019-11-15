import { Factory } from '../../interfaces/factory';
import { Policy } from './Policy';
import { ErrorsPolicy } from './ErrorsPolicy';
import { RatePolicy } from './RatePolicy';

export class PolicyFactory implements Factory<Policy> {

  constructor(
    private readonly threshold: number,
    private readonly policy: 'errors' | 'rate',
  ) { }

  public create(): Policy {
    switch (this.policy) {
      case 'errors':
        return new ErrorsPolicy(this.threshold);

      case 'rate':
        return new RatePolicy(this.threshold);

      default:
        throw new Error(`@circuit unsuported policy type: ${this.policy}`);
    }
  }

}
