import { expect } from 'chai';
import * as sinon from 'sinon';

import { BulkheadFactory } from '../../../lib/bulkhead/Bulkhead/factory';
import {
  InstanceBulkheadProvider,
} from '../../../lib/bulkhead/BulkheadProvider/InstanceBulkheadProvider';

describe('@bulkhead InstanceBulkheadProvider', () => {

  let bulkheadFactoryStub: sinon.SinonStubbedInstance<BulkheadFactory>;
  let service: InstanceBulkheadProvider;

  beforeEach(() => {
    bulkheadFactoryStub = sinon.createStubInstance(BulkheadFactory);

    service = new InstanceBulkheadProvider(bulkheadFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(InstanceBulkheadProvider));

  });

  describe('get', () => {

    it('should create new bulkhead instance if was called first time with this instance', () => {
      const result = {} as any;
      const instance = {} as any;
      bulkheadFactoryStub.create.returns(result);

      expect(service.get(instance)).to.equals(result);
    });

    it('should return already created bulkhead for current isntance', () => {
      const result = {} as any;
      bulkheadFactoryStub.create.returns(result);
      const instance = {} as any;
      service.get(instance);

      expect(service.get(instance)).to.equals(result);
    });

    it('should create new bulkhead with bulkheadFactory.create', () => {
      service.get({} as any);

      expect(bulkheadFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not create new bulkhead instance if already exists', () => {
      bulkheadFactoryStub.create.returns({} as any);
      const instance = {} as any;
      service.get(instance);
      bulkheadFactoryStub.create.reset();

      service.get(instance);

      expect(bulkheadFactoryStub.create.called).to.be.false;
    });

  });

});
