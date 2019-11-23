import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitState } from '../../../lib/circuit/CircuitState/CircuitState';
import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';
import { PolicyFactory } from '../../../lib/circuit/Policy/factory';

describe('@circuit CircuitStateFactory', () => {

  const timeout = 10;
  const interval = 5;
  const errorFilter: (error: Error) => boolean = () => true;
  let policyFactoryStub: sinon.SinonStubbedInstance<PolicyFactory>;
  let service: CircuitStateFactory;

  beforeEach(() => {
    policyFactoryStub = sinon.createStubInstance(PolicyFactory);

    service =
      new CircuitStateFactory(timeout, interval, errorFilter, policyFactoryStub as any, 'rate');
  });

  it('should create', () => {
    expect(service).to.be.instanceOf(CircuitStateFactory);
  });

  describe('create', () => {

    it('should call policyFactory.create to create policy', () => {
      service.create();

      expect(policyFactoryStub.create.calledOnce).to.be.true;
    });

    it('should return instance of CircuitState', () => {
      expect(service.create()).to.be.instanceOf(CircuitState);
    });

  });

});
