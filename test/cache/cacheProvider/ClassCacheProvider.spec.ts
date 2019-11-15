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

    it('should init cache property to null', () => expect(service['cache']).to.be.null);

  });

  describe('get', () => {

    it('should call CacheFactory.create to create an instance at first call', () => {
      const cacheInstance = {} as any;
      cacheFactoryStub.create.returns(cacheInstance);

      expect(service.get()).to.be.equals(cacheInstance);
      expect(cacheFactoryStub.create.calledOnce).to.be.true;
      expect(service['cache']).to.be.equals(cacheInstance);
    });

    it('should return existent instance of cache if is not first call', () => {
      const response = service['cache'] = {} as any;

      expect(cacheFactoryStub.create.called).to.be.false;
      expect(service.get()).to.be.equals(response);
    });

  });

});
