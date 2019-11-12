import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ClassCircuit implements CircuitStateStorage {

  private readonly circuitState: CircuitState;

  constructor(circuitStateFunction: () => CircuitState) {
    this.circuitState = circuitStateFunction();
  }

  public get(): CircuitState {
    return this.circuitState;
  }

}
