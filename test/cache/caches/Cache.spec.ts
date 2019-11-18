import { expect } from 'chai';
import * as sinon from 'sinon';

import { Cache } from '../../../lib/cache/caches/Cache';
import { AbsoluteExpiration } from '../../../lib/cache/expirations/AbsoluteExpiration';
import { Expiration } from '../../../lib/cache/expirations/Expiration';
import { MemoryStorage } from '../../../lib/cache/storages/MemoryStorage';
import { Storage } from '../../../lib/cache/storages/Storage';
import { HashService } from '../../../lib/utils/hash';

describe('@cache Cache', () => {

  let hashStub: sinon.SinonStubbedInstance<HashService>;
  let storageStub: sinon.SinonStubbedInstance<Storage>;
  let expirationStub: sinon.SinonStubbedInstance<Expiration>;
  let service: Cache;

  beforeEach(() => {
    hashStub = sinon.createStubInstance(HashService);
    storageStub = sinon.createStubInstance(MemoryStorage);
    expirationStub = sinon.createStubInstance(AbsoluteExpiration);

    service = new Cache(storageStub, expirationStub, hashStub);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(Cache));

  });

  describe('set', () => {

    it('should call hash.calculate to obtain arguments hash', async () => {
      await service.set(['key'], 'value');

      expect(hashStub.calculate.calledOnce).to.be.true;
    });

    it('should call storage.set to store given hashed key and data', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.set(['key'], 'value');

      expect(storageStub.set.calledOnce).to.be.true;
    });

    it('should call storage.set to store given hashed key with correct parameters', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.set(['key'], 'value');

      expect(storageStub.set.calledWithExactly(key, 'value')).to.be.true;
    });

    it('should call expiration.add to make cache expirable', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.set(['key'], 'value');

      expect(expirationStub.add.calledOnce).to.be.true;
    });

    it('should call expiration.add with correct parameters', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.set(['key'], 'value');

      expect(expirationStub.add.calledWith(key, sinon.match.func)).to.be.true;
    });

    describe('function passed to expiration', () => {

      it('should call storage.delete', async () => {
        const key = 'key';
        hashStub.calculate.returns(key);

        await service.set(['key'], 'value');

        const callback = expirationStub.add.firstCall.args[1];

        await callback(key);

        expect(storageStub.delete.calledOnce).to.be.true;
      });

      it('should call storage.delte with correct parameters', async () => {
        const key = 'key';
        hashStub.calculate.returns(key);

        await service.set(['key'], 'value');

        const callback = expirationStub.add.firstCall.args[1];

        await callback(key);

        expect(storageStub.delete.calledWith(key)).to.be.true;
      });

    });

  });

  describe('has', () => {

    it('should call hash.calculate to obtain arguments hash', async () => {
      await service.has(['key']);

      expect(hashStub.calculate.calledOnce).to.be.true;
    });

    it('should call storage has to check if key exists', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.has(['key']);

      expect(storageStub.has.calledWith(key)).to.be.true;
    });

    it('should call storage has with correct parameters', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.has(['key']);

      expect(storageStub.has.calledWith(key)).to.be.true;
    });

  });

  describe('get', () => {

    it('should call hash.calculate to obtain arguments hash', async () => {
      await service.get(['key']);

      expect(hashStub.calculate.calledOnce).to.be.true;
    });

    it('should call expiration.add to update cache expiration', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.get(['key']);

      expect(expirationStub.add.calledOnce).to.be.true;
    });

    it('should call expiration.add with correct parameters', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.get(['key']);

      expect(expirationStub.add.calledWith(key, sinon.match.func)).to.be.true;
    });

    it('should call storage.get to obtain cached value', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.get(['key']);

      expect(storageStub.get.calledOnce).to.be.true;
    });

    it('should call storage.get with correct parameters', async () => {
      const key = 'key';
      hashStub.calculate.returns(key);

      await service.get(['key']);

      expect(storageStub.get.calledWith(key)).to.be.true;
    });

    describe('function passed to expiration', () => {

      it('should call storage.delete once', async () => {
        const key = 'key';
        hashStub.calculate.returns(key);

        await service.get(['key']);

        const callback = expirationStub.add.firstCall.args[1];

        await callback(key);

        expect(storageStub.delete.calledOnce).to.be.true;
      });

      it('should call storage.delete with correct parameters', async () => {
        const key = 'key';
        hashStub.calculate.returns(key);

        await service.get(['key']);

        const callback = expirationStub.add.firstCall.args[1];

        await callback(key);

        expect(storageStub.delete.calledWith(key)).to.be.true;
      });

    });

  });

});
