import { ClassType } from '../../interfaces/class';
import { Cache } from '../caches/Cache';

export interface CacheProvider<K = any> {
  get(instance: ClassType): Cache<K>;
}
