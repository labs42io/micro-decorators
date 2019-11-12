import { ClassType } from '../../interfaces/class';
import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateStorage } from './CircuitStateStorage';

export class InstanceCircuit implements CircuitStateStorage {

  private readonly instancesStorage = new WeakMap<ClassType, CircuitState>();

  constructor(
    private readonly circuitStateFunction: () => CircuitState,
  ) { }

  public get(_: any[], instance: ClassType): CircuitState {
    if (!this.instancesStorage.has(instance)) {
      this.instancesStorage.set(instance, this.circuitStateFunction());
    }

    return this.instancesStorage.get(instance);
  }

}
