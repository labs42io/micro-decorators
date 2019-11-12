import { CircuitOptions, DEFAULT_SCOPE } from '../CircuitOptions';
import { CircuitState } from '../CircuitState/CircuitState';
import { ArgumentsCircuit } from '../CircuitStateStorage/ArgumentsCircuitStateStorage';
import { CircuitStateStorage } from '../CircuitStateStorage/CircuitStateStorage';
import { ClassCircuit } from '../CircuitStateStorage/ClassCircuitStateStorage';
import { InstanceCircuit } from '../CircuitStateStorage/InstanceCircuitStateStorage';
import { circuitStateFactory } from './circuitStateFactory';

type CircuitFactory = (circuitState: () => CircuitState) => CircuitStateStorage;

const factories: ReadonlyMap<'args-hash' | 'class' | 'instance', CircuitFactory> =
  new Map<'args-hash' | 'class' | 'instance', CircuitFactory>()
    .set('args-hash', circuitState => new ArgumentsCircuit(circuitState))
    .set('instance', circuitState => new InstanceCircuit(circuitState))
    .set('class', circuitState => new ClassCircuit(circuitState));

export function circuitStateStorageFactory(
  threshold: number,
  timeout: number,
  options: CircuitOptions,
): CircuitStateStorage {

  const scope = options.scope || DEFAULT_SCOPE;

  const circuitStateFunction = () => circuitStateFactory(threshold, timeout, options);

  const factory = factories.get(scope);

  if (!factory) {
    throw new Error(`@circuit unsuported scope option: ${scope}`);
  }

  return factory(circuitStateFunction);
}
