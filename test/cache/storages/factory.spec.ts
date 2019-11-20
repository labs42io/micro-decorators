import { expect } from 'chai';

import { StorageFactory } from '../../../lib/cache/storages/factory';
import { MemoryStorage } from '../../../lib/cache/storages/MemoryStorage';

describe('@cache StorageFactory', () => {

  const limit = 42;
  let service: StorageFactory;

  beforeEach(() => service = new StorageFactory(limit));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(StorageFactory));

  });

  describe('create', () => {

    it('should return instance of StorageFactory if storage is "memory"', () => {
      expect(service.create('memory')).to.be.instanceOf(MemoryStorage);
    });

    it('should throw error if storate is not an valid storage', () => {
      const storage = 'memory3' as any;
      const message = `@cache Storage type is not supported: ${storage}.`;
      expect(() => service.create(storage)).to.throw(message);
    });

  });

});
