import * as hash from 'object-hash';

import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateFactory } from '../CircuitState/factory';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ArgumentsCircuitStateStorage implements CircuitStateStorage {

  private readonly argumentsStorage = new Map<string, CircuitState>();

  constructor(private readonly circuitStateFactory: CircuitStateFactory) { }

  public get(args: any[]): CircuitState {
    const key = hash(args);
    if (!this.argumentsStorage.has(key)) {
      this.argumentsStorage.set(key, this.circuitStateFactory.create());
    }

    return this.argumentsStorage.get(key);
  }

}
