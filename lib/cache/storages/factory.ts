import { Factory } from '../../interfaces/factory';
import { MemoryStorage } from './MemoryStorage';
import { Storage } from './Storage';

export class StorageFactory implements Factory<Storage, ['memory']> {

  constructor(
    private readonly limit: number,
  ) { }

  public create(storage: 'memory'): Storage {
    switch (storage) {
      case 'memory':
        return new MemoryStorage(this.limit);

      default:
        throw new Error(`@cache Storage type is not supported: ${storage}.`);
    }
  }

}
