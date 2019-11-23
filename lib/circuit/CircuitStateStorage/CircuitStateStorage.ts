import { ClassType } from '../../interfaces/class';
import { CircuitState } from '../CircuitState/CircuitState';

export interface CircuitStateStorage {
  get(args: any[], instance: ClassType): CircuitState;
}
