import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateFactory } from '../CircuitState/factory';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ClassCircuitStateStorage implements CircuitStateStorage {

  private circuitState: CircuitState = null;

  constructor(private readonly circuitStateFactory: CircuitStateFactory) { }

  public get(): CircuitState {
    if (!this.circuitState) {
      this.circuitState = this.circuitStateFactory.create();
    }

    return this.circuitState;
  }

}
