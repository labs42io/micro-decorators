import { HashService } from '../../utils/hash';
import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateFactory } from '../CircuitState/factory';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ArgumentsCircuitStateStorage implements CircuitStateStorage {

  private readonly argumentsStorage = new Map<string, CircuitState>();

  constructor(
    private readonly circuitStateFactory: CircuitStateFactory,
    private readonly hashService: HashService,
  ) { }

  public get(args: any[]): CircuitState {
    const key = this.hashService.calculate(args);
    if (!this.argumentsStorage.has(key)) {
      const circuitState = this.circuitStateFactory.create(() => this.argumentsStorage.delete(key));
      this.argumentsStorage.set(key, circuitState);
    }

    return this.argumentsStorage.get(key);
  }

}
