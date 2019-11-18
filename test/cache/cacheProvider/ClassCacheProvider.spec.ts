import { expect } from 'chai';
import * as sinon from 'sinon';

import { ClassCacheProvider } from '../../../lib/cache/cacheProvider/ClassCacheProvider';
import { CacheFactory } from '../../../lib/cache/caches/factory';

describe('@cache ClassCacheProvider', () => {

  let cacheFactoryStub: sinon.SinonStubbedInstance<CacheFactory>;
  let service: ClassCacheProvider;

  beforeEach(() => {
    cacheFactoryStub = sinon.createStubInstance(CacheFactory);

    service = new ClassCacheProvider(cacheFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ClassCacheProvider));

  });

  describe('get', () => {

    it('should call CacheFactory.create to create an instance at first call', () => {
      service.get();

      expect(cacheFactoryStub.create.calledOnce).to.be.true;
    });

    it('should return instance create from cahceFactory', () => {
      const cacheInstance = {} as any;
      cacheFactoryStub.create.returns(cacheInstance);

      expect(service.get()).to.equals(cacheInstance);
    });

    it('should return existent instance of cache if is not first call', () => {
      const cacheInstance = {} as any;
      cacheFactoryStub.create.returns(cacheInstance);
      service.get();

      expect(service.get()).to.equals(cacheInstance);
    });

    it('should not call CacheFactory.create if instance of cache service exists', () => {
      cacheFactoryStub.create.returns({} as any);
      service.get();
      cacheFactoryStub.create.reset();

      service.get();

      expect(cacheFactoryStub.create.called).to.be.false;
    });

    it('should not call CacheFactory.create if instance of cache service exists', () => {
      service['cache'] = {} as any;

      service.get();

      expect(cacheFactoryStub.create.called).to.be.false;
    });

  });

});
