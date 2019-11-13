import { ClassType } from '../../interfaces/class';
import { Cache } from '../caches/Cache';

export interface CacheManager<K = any> {
  get(instance: ClassType): Cache<K>;
}
