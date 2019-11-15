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

    it('should init instancesCaches property', () => {
      expect(service['instanceCaches']).to.be.instanceOf(WeakMap);
    });

  });

  describe('get', () => {

    it('should create new cache instance if was called first time with this instance', () => {
      const result = {} as any;
      const instance = {} as any;
      cacheFactoryStub.create.returns(result);

      expect(service.get(instance)).to.be.equals(result);
      expect(service['instanceCaches'].get(instance)).to.be.equals(result);
      expect(cacheFactoryStub.create.calledOnce).to.be.true;
    });

    it('should return already created cache for current isntance', () => {
      const result = {} as any;
      const instance = {} as any;
      service['instanceCaches'].set(instance, result);

      expect(service.get(instance)).to.be.equals(result);
      expect(cacheFactoryStub.create.called).to.be.false;
    });

  });

});
