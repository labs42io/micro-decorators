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
        return new ArgumentsCircuitStateStorage(this.circuitStateFactory);

      case 'class':
        return new ClassCircuitStateStorage(this.circuitStateFactory);

      case 'instance':
        return new InstanceCircuitStateStorage(this.circuitStateFactory);

      default:
        throw new Error(`@circuit unsuported scope option: ${this.scope}`);
    }
  }

}
