import { expect } from 'chai';
import * as sinon from 'sinon';

import { Bulkhead } from '../../../lib/bulkhead/Bulkhead/Bulkhead';
import { BulkheadFactory } from '../../../lib/bulkhead/Bulkhead/factory';
import { ExecutionQueueFactory } from '../../../lib/bulkhead/ExecutionQueue/factory';

describe('@bulkhead BulkheadFactory', () => {

  const threshold = 3;
  let executionQueueFactoryStub: sinon.SinonStubbedInstance<ExecutionQueueFactory>;
  let service: BulkheadFactory;

  beforeEach(() => {
    executionQueueFactoryStub = sinon.createStubInstance(ExecutionQueueFactory);

    service = new BulkheadFactory(threshold, executionQueueFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(BulkheadFactory));

  });

  describe('create', () => {

    it('should call executionQueueFactory.create to create instance of Execution Queue', () => {
      service.create();

      expect(executionQueueFactoryStub.create.calledOnce).to.be.true;
    });

    it('should return instance of bulkhead', () => {
      expect(service.create()).to.be.instanceOf(Bulkhead);
    });

  });

});
