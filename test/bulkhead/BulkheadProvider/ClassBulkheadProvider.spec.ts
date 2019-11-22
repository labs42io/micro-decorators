import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  ClassBulkheadProvider,
} from '../../../lib/bulkhead/BulkheadProvider/ClassBulkheadProvider';
import { BulkheadFactory } from '../../../lib/bulkhead/Bulkhead/factory';

describe('@bulkhead BulkheadProvider', () => {

  let bulkheadFactoryStub: sinon.SinonStubbedInstance<BulkheadFactory>;
  let service: ClassBulkheadProvider;

  beforeEach(() => {
    bulkheadFactoryStub = sinon.createStubInstance(BulkheadFactory);

    service = new ClassBulkheadProvider(bulkheadFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ClassBulkheadProvider));

  });

  describe('get', () => {

    it('it should call BulkheadFactory.create to create Bulkhead instance', () => {
      service.get();

      expect(bulkheadFactoryStub.create.calledOnce).to.be.true;
    });

    it('it should call BulkheadFactory.create only at first call', () => {
      bulkheadFactoryStub.create.returns({} as any);
      service.get();
      bulkheadFactoryStub.create.reset();

      service.get();

      expect(bulkheadFactoryStub.create.called).to.be.false;
    });

    it('should return every time same instance', () => {
      expect(service.get()).to.equals(service.get());
    });

    it('should return created result from BulkheadFactory.create', () => {
      const expected = {} as any;
      bulkheadFactoryStub.create.returns(expected);

      expect(service.get()).to.equals(expected);
    });

  });

});
