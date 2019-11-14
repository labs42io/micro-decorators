import { ClassType } from '../../interfaces/class';
import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateFactory } from '../CircuitState/factory';
import { CircuitStateStorage } from './CircuitStateStorage';

export class InstanceCircuitStateStorage implements CircuitStateStorage {

  private readonly instancesStorage = new WeakMap<ClassType, CircuitState>();

  constructor(private readonly circuitStateFactory: CircuitStateFactory) { }

  public get(_: any[], instance: ClassType): CircuitState {
    const hasState = this.instancesStorage.has(instance);
    if (!hasState) {
      this.instancesStorage.set(instance, this.circuitStateFactory.create());
    }

    return this.instancesStorage.get(instance);
  }

}
