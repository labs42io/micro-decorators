import { expect } from 'chai';
import * as sinon from 'sinon';

import { BulkheadFactory } from '../../../lib/bulkhead/Bulkhead/factory';
import {
  ClassBulkheadProvider,
} from '../../../lib/bulkhead/BulkheadProvider/ClassBulkheadProvider';
import { BulkheadProviderFactory } from '../../../lib/bulkhead/BulkheadProvider/factory';
import {
  InstanceBulkheadProvider,
} from '../../../lib/bulkhead/BulkheadProvider/InstanceBulkheadProvider';

describe('@bulkhead BulkheadProviderFactory', () => {

  let bulkheadFactoryStub: sinon.SinonStubbedInstance<BulkheadFactory>;
  let service: BulkheadProviderFactory;

  beforeEach(() => {
    bulkheadFactoryStub = sinon.createStubInstance(BulkheadFactory);

    service = new BulkheadProviderFactory(bulkheadFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(BulkheadProviderFactory));

  });

  describe('create', () => {

    it('should create instanceof ClassBulkheadProvider if scope is "class"', () => {
      expect(service.create('class')).to.be.instanceOf(ClassBulkheadProvider);
    });

    it('should create instanceof InstanceBulkheadProvider if scope is "instance"', () => {
      expect(service.create('instance')).to.be.instanceOf(InstanceBulkheadProvider);
    });

    it('should throw error if scope options is not a valid one', () => {
      const scope = '123' as any;
      const message = `@bulkhead unsuported scope type: ${scope}.`;

      expect(() => service.create(scope)).to.throw(message);
    });

  });

});
