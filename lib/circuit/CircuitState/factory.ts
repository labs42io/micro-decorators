import { Factory } from '../../interfaces/factory';
import { PolicyFactory } from '../Policy/factory';
import { CircuitState } from './CircuitState';

export class CircuitStateFactory implements Factory<CircuitState, [(() => unknown)?]> {

  constructor(
    private readonly timeout: number,
    private readonly interval: number,
    private readonly errorFilter: (error: Error) => boolean,
    private readonly policyFactory: PolicyFactory,
    private readonly policy: 'errors' | 'rate',
  ) { }

  public create(clearCallback: () => unknown = () => { }): CircuitState {
    const policy = this.policyFactory.create(this.policy);

    return new CircuitState(this.timeout, this.interval, this.errorFilter, policy, clearCallback);
  }

}
