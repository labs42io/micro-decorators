import { expect } from 'chai';

import { StorageFactory } from '../../../lib/cache/storages/factory';
import { MemoryStorage } from '../../../lib/cache/storages/MemoryStorage';

describe('@cache StorageFactory', () => {

  describe('constructor', () => {

    it('should create', () => {
      expect(new StorageFactory(3, 'memory')).to.be.instanceOf(StorageFactory);
    });

  });

  describe('create', () => {

    it('should return instance of StorageFactory if storage is "memory"', () => {
      expect(new StorageFactory(3, 'memory').create()).to.be.instanceOf(MemoryStorage);
    });

    it('should throw error if storate is not an valid storage', () => {
      const storage = 'memory3';
      const message = `@cache Storage type is not supported: ${storage}.`;
      expect(() => new StorageFactory(3, 'memory3' as any).create()).to.throw(message);
    });

  });

});
