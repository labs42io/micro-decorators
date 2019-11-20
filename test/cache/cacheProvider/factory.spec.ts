import { expect } from 'chai';
import * as sinon from 'sinon';

import { ClassCacheProvider } from '../../../lib/cache/cacheProvider/ClassCacheProvider';
import { CacheProviderFactory } from '../../../lib/cache/cacheProvider/factory';
import { InstanceCacheProvider } from '../../../lib/cache/cacheProvider/InstanceCacheProvider';
import { CacheFactory } from '../../../lib/cache/caches/factory';

describe('@cache CacheProviderFactory', () => {

  let cacheFactoryStub: sinon.SinonStubbedInstance<CacheFactory>;
  let service: CacheProviderFactory;

  beforeEach(() => {
    cacheFactoryStub = sinon.createStubInstance(CacheFactory);

    service = new CacheProviderFactory(cacheFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(CacheProviderFactory));

  });

  describe('create', () => {

    it('should create instanceof ClassCacheProvider if scope is "class"', () => {
      expect(service.create('class')).to.be.instanceOf(ClassCacheProvider);
    });

    it('should create instanceof InstanceCacheProvider if scope is "instance"', () => {
      expect(service.create('instance')).to.be.instanceOf(InstanceCacheProvider);
    });

    it('should throw error if scope options is not a valid one', () => {
      const scope = '123' as any;
      const message = `@cache invalid scope option: ${scope}.`;

      expect(() => service.create(scope)).to.throw(message);
    });

  });

});
