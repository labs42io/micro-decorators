import { CacheOptions } from '..';
import { MemoryStorage } from '../storages/MemoryStorage';
import { Storage } from '../storages/Storage';

const storeFactories: ReadonlyMap<'memory', (limit: number) => Storage> =
  new Map<'memory', (limit: number) => Storage>()
    .set('memory', limit => new MemoryStorage(limit));

export function storeFactory(options: CacheOptions): Storage {
  const { size, storage } = options;

  const factory = storeFactories.get(storage);

  if (!factory) {
    throw new Error(`@cache Storage type is not supported: ${storage}.`);
  }

  return factory(size);
}
