import { expect } from 'chai';

import { ExecutionQueue } from '../../../lib/bulkhead/ExecutionQueue/ExecutionQueue';
import { ExecutionQueueFactory } from '../../../lib/bulkhead/ExecutionQueue/factory';

describe('@bulkhead ExecutionQueueFactory', () => {

  const limit = 3;
  let service: ExecutionQueueFactory;

  beforeEach(() => service = new ExecutionQueueFactory(limit));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ExecutionQueueFactory));

  });

  describe('create', () => {

    it('should return instance of Execution Queue', () => {
      expect(service.create()).to.be.instanceOf(ExecutionQueue);
    });

    it('should return every time antother instance of Execution Queue', () => {
      expect(service.create()).not.to.equals(service.create());
    });

  });

});
