import { expect } from 'chai';

import { MemoryStorage } from '../../../lib/cache/storages/MemoryStorage';

describe('@cache MemoryStorage', () => {

  let service: MemoryStorage;

  beforeEach(() => service = new MemoryStorage());

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(MemoryStorage));

  });

  describe('set', () => {

    it('should remove oldest key if limit is reached', () => {
      const service = new MemoryStorage(2);
      service['storage'].set('a', 1).set('b', 2);

      service.set('c', 3);

      expect(Array.from(service['storage'].keys())).to.be.deep.equals(['b', 'c']);
    });

    it('should set key and value to storage', () => {
      const key = 'key';
      const value = 42;
      service.set(key, value);

      expect(service['storage'].get(key)).to.equals(value);
    });

    it('should return self instance', async () => {
      expect(await service.set('key', 'value')).to.equals(service);
    });

  });

  describe('get', () => {

    it('should return value from storage', async () => {
      service['storage'].set('key', 'value');
      expect(await service.get('key')).to.equals(service['storage'].get('key'));
    });

  });

  describe('has', () => {

    it('should return true if key is in storage', async () => {
      service['storage'].set('key', 'value');
      expect(await service.has('key')).to.be.true;
    });

    it('should retunr false if key is not in storage', async () => {
      expect(await service.has('key')).to.be.false;
    });

  });

  describe('delete', () => {

    it('should delete key from storage', async () => {
      service['storage'].set('key', '123');

      await service.delete('key');

      expect(service['storage'].has('key')).to.be.false;
    });

    it('should return self instance', async () => {
      expect(await service.delete('key')).to.equals(service);
    });

  });

});
