import { ClassType } from '../../interfaces/class';

export interface Cache<K> {
  set<V>(key: K, value: V, instance: ClassType): void;
  get<V>(key: K, instance: ClassType): V;
}
