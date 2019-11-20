import { expect } from 'chai';

import { MemoryStorage } from '../../../lib/cache/storages/MemoryStorage';

describe('@cache MemoryStorage', () => {

  let service: MemoryStorage;

  beforeEach(() => service = new MemoryStorage());

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(MemoryStorage));

  });

  describe('set', () => {

    it('should set key and value to storage', async () => {
      const key = 'key';
      const value = 42;

      await service.set(key, value);

      expect(await service.get(key)).to.equals(value);
    });

    it('should remove oldest key if limit is reached', async () => {
      const service = new MemoryStorage(2);
      await service.set('a', 1);
      await service.set('b', 2);

      await service.set('c', 3);

      expect(await service.has('a')).to.be.false;
    });

    it('should return self instance', async () => {
      expect(await service.set('key', 'value')).to.equals(service);
    });

  });

  describe('get', () => {

    it('should return value from storage', async () => {
      await service.set('key', 'value');
      expect(await service.get('key')).to.equals('value');
    });

  });

  describe('has', () => {

    it('should return true if key is in storage', async () => {
      await service.set('key', 'value');
      expect(await service.has('key')).to.be.true;
    });

    it('should return false if key is not in storage', async () => {
      expect(await service.has('key')).to.be.false;
    });

  });

  describe('delete', () => {

    it('should delete key from storage', async () => {
      await service.set('key', '123');

      await service.delete('key');

      expect(await service.has('key')).to.be.false;
    });

    it('should return self instance', async () => {
      expect(await service.delete('key')).to.equals(service);
    });

  });

});
