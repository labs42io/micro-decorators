import { CacheOptions } from '..';
import { MemoryStorage } from './MemoryStorage';
import { Storage } from './Storage';

const storeFactories: ReadonlyMap<'memory', (limit: number) => Storage> =
  new Map<'memory', (limit: number) => Storage>()
    .set('memory', limit => new MemoryStorage(limit));

export function storageFactory(options: CacheOptions): Storage {
  const { size, storage } = options;

  const factory = storeFactories.get(storage);

  if (!factory) {
    throw new Error(`@cache Storage type is not supported: ${storage}.`);
  }

  return factory(size);
}
