import { Factory } from '../../interfaces/factory';
import { PolicyFactory } from '../Policy/factory';
import { CircuitState } from './CircuitState';
import { CircuitOptions } from '../CircuitOptions';

export class CircuitStateFactory implements Factory<CircuitState> {


  constructor(
    private readonly timeout: number,
    private readonly interval: number,
    private readonly errorFilter: (error: Error) => boolean,
    private readonly policyFactory: PolicyFactory,
  ) {
    [this.interval, this.errorFilter] = [interval, errorFilter];
  }

  public create(): CircuitState {
    const policy = this.policyFactory.create();

    return new CircuitState(this.timeout, this.interval, this.errorFilter, policy);
  }

}
