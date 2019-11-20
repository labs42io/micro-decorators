import { expect } from 'chai';
import * as sinon from 'sinon';

import { InstanceCacheProvider } from '../../../lib/cache/cacheProvider/InstanceCacheProvider';
import { CacheFactory } from '../../../lib/cache/caches/factory';

describe('@cache InstanceCacheProvider', () => {

  let cacheFactoryStub: sinon.SinonStubbedInstance<CacheFactory>;
  let service: InstanceCacheProvider;

  beforeEach(() => {
    cacheFactoryStub = sinon.createStubInstance(CacheFactory);

    service = new InstanceCacheProvider(cacheFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(InstanceCacheProvider));

  });

  describe('get', () => {

    it('should create new cache instance if was called first time with this instance', () => {
      const result = {} as any;
      const instance = {} as any;
      cacheFactoryStub.create.returns(result);

      expect(service.get(instance)).to.equals(result);
    });

    it('should return already created cache for current isntance', () => {
      const result = {} as any;
      cacheFactoryStub.create.returns(result);
      const instance = {} as any;
      service.get(instance);

      expect(service.get(instance)).to.equals(result);
    });

    it('should create new cahce with cacheFactory.create', () => {
      service.get({} as any);

      expect(cacheFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not create new cache cache instance if already exists', () => {
      cacheFactoryStub.create.returns({} as any);
      const instance = {} as any;
      service.get(instance);
      cacheFactoryStub.create.reset();

      service.get(instance);

      expect(cacheFactoryStub.create.called).to.be.false;
    });

  });

});
