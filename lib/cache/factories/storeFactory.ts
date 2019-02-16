import { CacheOptions } from '..';
import { DEFAULT_SIZE, DEFAULT_STORAGE } from '../CacheOptions';
import { MemoryStorage } from '../storages/MemoryStorage';
import { Storage } from '../storages/Storage';

export function storeFactory<K>(options: CacheOptions): Storage<K> {
  const limit = options.size || DEFAULT_SIZE;
  const storage = options.storage || DEFAULT_STORAGE;

  switch (storage) {
    case 'memory':
      return new MemoryStorage<K>(limit);

    default:
      throw new Error('Storage type is not supported.');
  }
}
