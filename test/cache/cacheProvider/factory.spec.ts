import { expect } from 'chai';

import { ClassCacheProvider } from '../../../lib/cache/cacheProvider/ClassCacheProvider';
import { CacheProviderFactory } from '../../../lib/cache/cacheProvider/factory';
import { InstanceCacheProvider } from '../../../lib/cache/cacheProvider/InstanceCacheProvider';

describe('@cache CacheProviderFactory', () => {

  describe('constructor', () => {

    it('should create', () => {
      expect(new CacheProviderFactory('class', undefined)).to.be.instanceOf(CacheProviderFactory);
    });

  });

  describe('create', () => {

    it('should create instanceof ClassCacheProvider if scope is "class"', () => {
      const instance = new CacheProviderFactory('class', undefined);
      expect(instance.create()).to.be.instanceOf(ClassCacheProvider);
    });

    it('should create instanceof InstanceCacheProvider if scope is "instance"', () => {
      const instance = new CacheProviderFactory('instance', undefined);
      expect(instance.create()).to.be.instanceOf(InstanceCacheProvider);
    });

    it('should throw error if scope options is not a valid one', () => {
      const scope = '123' as any;
      const message = `@cache invalid scope option: ${scope}.`;

      const instance = new CacheProviderFactory(scope, undefined);

      expect(() => instance.create()).to.throw(message);
    });

  });

});
