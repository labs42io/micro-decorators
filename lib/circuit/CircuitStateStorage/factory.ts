import { Factory } from '../../interfaces/factory';
import { HashService } from '../../utils/hash';
import { CircuitStateFactory } from '../CircuitState/factory';
import { ArgumentsCircuitStateStorage } from './ArgumentsCircuitStateStorage';
import { CircuitStateStorage } from './CircuitStateStorage';
import { ClassCircuitStateStorage } from './ClassCircuitStateStorage';
import { InstanceCircuitStateStorage } from './InstanceCircuitStateStorage';

export class CircuitStateStorageFactory
  implements Factory<CircuitStateStorage, ['args-hash' | 'class' | 'instance']> {

  constructor(
    private readonly circuitStateFactory: CircuitStateFactory,
    private readonly hashService: HashService,
  ) { }

  public create(scope: 'args-hash' | 'class' | 'instance'): CircuitStateStorage {
    switch (scope) {
      case 'args-hash':
        return new ArgumentsCircuitStateStorage(this.circuitStateFactory, this.hashService);

      case 'class':
        return new ClassCircuitStateStorage(this.circuitStateFactory);

      case 'instance':
        return new InstanceCircuitStateStorage(this.circuitStateFactory);

      default:
        throw new Error(`@circuit unsuported scope option: ${scope}`);
    }
  }

}
