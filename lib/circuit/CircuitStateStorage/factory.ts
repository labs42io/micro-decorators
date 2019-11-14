import { Factory } from '../../interfaces/factory';
import { CircuitStateFactory } from '../CircuitState/factory';
import { CircuitStateStorage } from './CircuitStateStorage';
import { ArgumentsCircuitStateStorage } from './ArgumentsCircuitStateStorage';
import { ClassCircuitStateStorage } from './ClassCircuitStateStorage';
import { InstanceCircuitStateStorage } from './InstanceCircuitStateStorage';

export class CircuitStateStorageFactory implements Factory<CircuitStateStorage> {

  constructor(
    private readonly scope: 'args-hash' | 'class' | 'instance',
    private readonly circuitStateFactory: CircuitStateFactory,
  ) { }

  public create(): CircuitStateStorage {
    switch (this.scope) {
      case 'args-hash':
        return this.argumentsCircuitStateStorage();

      case 'class':
        return this.classCircuitStateStorage();

      case 'instance':
        return this.instanceCircuitStateStorage();

      default:
        throw new Error(`@circuit unsuported scope option: ${this.scope}`);
    }
  }

  private argumentsCircuitStateStorage(): ArgumentsCircuitStateStorage {
    return new ArgumentsCircuitStateStorage(this.circuitStateFactory);
  }

  private classCircuitStateStorage(): ClassCircuitStateStorage {
    return new ClassCircuitStateStorage(this.circuitStateFactory);
  }

  private instanceCircuitStateStorage(): InstanceCircuitStateStorage {
    return new InstanceCircuitStateStorage(this.circuitStateFactory);
  }

}
