import { expect } from 'chai';

import { ExecutionQueue } from '../../../lib/bulkhead/ExecutionQueue/ExecutionQueue';
import { repeat } from '../../utils';
import { ExecutionMetaData } from '../../../lib/bulkhead/types';

describe('@bulkhead ExecutionQueue', () => {

  const limit = 3;
  const resolve = () => { };
  const reject = () => { };
  const args = [];
  const method = () => Promise.resolve();
  let service: ExecutionQueue;

  beforeEach(() => service = new ExecutionQueue(limit));

  describe('constructor', () => {

    it('should create', () => expect(new ExecutionQueue()).to.be.instanceOf(ExecutionQueue));

  });

  describe('store', () => {

    it('should store given data', () => {
      service.store({ method, args, resolve, reject });

      expect(service.next()).to.be.deep.equals({ method, args, resolve, reject });
    });

    it('should throw if limit is reached', () => {
      repeat(() => service.store(null), limit);

      expect(() => service.store(null)).to.throw();
    });

    it('should return self instance', () => {
      expect(service.store(null)).to.equals(service);
    });

  });

  describe('next', () => {

    it('should return undefined if not stored data', () => {
      expect(service.next()).to.equals(undefined);
    });

    it('should return data in reverse order of storing', () => {
      const firstExecutionData: ExecutionMetaData = { method, args, resolve, reject };
      const secondExecutionData: ExecutionMetaData = { method, args, resolve, reject };

      service.store(firstExecutionData);
      service.store(secondExecutionData);

      expect(service.next()).to.equals(firstExecutionData);
    });

    it('should remove data when return it', () => {
      const firstExecutionData: ExecutionMetaData = { method, args, resolve, reject };
      const secondExecutionData: ExecutionMetaData = { method, args, resolve, reject };

      service.store(firstExecutionData);
      service.store(secondExecutionData);
      service.next();

      expect(service.next()).to.equals(secondExecutionData);
    });

  });

});
