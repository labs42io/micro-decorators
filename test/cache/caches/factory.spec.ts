import { expect } from 'chai';
import * as sinon from 'sinon';

import { Cache } from '../../../lib/cache/caches/Cache';
import { CacheFactory } from '../../../lib/cache/caches/factory';
import { ExpirationFactory } from '../../../lib/cache/expirations/factory';
import { StorageFactory } from '../../../lib/cache/storages/factory';
import { HashService } from '../../../lib/utils/hash';

describe('@cache CacheFactory', () => {

  const expiration = 'absolute';
  const storage = 'memory';
  let expirationFactoryStub: sinon.SinonStubbedInstance<ExpirationFactory>;
  let storageFactoryStub: sinon.SinonStubbedInstance<StorageFactory>;
  let hashStub: sinon.SinonStubbedInstance<HashService>;
  let service: CacheFactory;

  beforeEach(() => {
    expirationFactoryStub = sinon.createStubInstance(ExpirationFactory);
    storageFactoryStub = sinon.createStubInstance(StorageFactory);
    hashStub = sinon.createStubInstance(HashService);

    service = new CacheFactory(
      hashStub,
      expirationFactoryStub as any,
      storageFactoryStub as any,
      expiration,
      storage,
    );
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(CacheFactory));

  });

  describe('create', () => {

    it('should call expirationFactory.create to obtain expiration', () => {
      service.create();

      expect(expirationFactoryStub.create.calledOnce).to.be.true;
    });

    it('should call expirationFactory.create with correct parameters', () => {
      service.create();

      expect(expirationFactoryStub.create.calledWith(expiration)).to.be.true;
    });

    it('should call storageFactory.create to obtain storage', () => {
      service.create();

      expect(storageFactoryStub.create.calledOnce).to.be.true;
    });

    it('should call storageFactory.create with correct parameters', () => {
      service.create();

      expect(storageFactoryStub.create.calledWith(storage)).to.be.true;
    });

    it('should return instance of Cahce', () => {
      expect(service.create()).to.be.instanceOf(Cache);
    });

  });

});
