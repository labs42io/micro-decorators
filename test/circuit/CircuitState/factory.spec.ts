import * as chai from 'chai';

import { CircuitState } from '../../../lib/circuit/CircuitState/CircuitState';
import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';
import { PolicyFactory } from '../../../lib/circuit/Policy/factory';
import { SpyObj } from '../../utils';

const expect = chai.expect;

describe('@circuit CircuitStateFactory', () => {

  const timeout = 10;
  const interval = 5;
  const errorFilter: (error: Error) => boolean = () => true;
  let policyFactorySpy: SpyObj<PolicyFactory>;
  let service: CircuitStateFactory;

  beforeEach(() => {
    policyFactorySpy = {
      create: chai.spy('policy factory spy create', () => ({} as any)),
    };

    service = new CircuitStateFactory(timeout, interval, errorFilter, policyFactorySpy as any);
  });

  it('should create', () => {
    expect(service).to.be.instanceOf(CircuitStateFactory);
  });

  describe('create', () => {

    it('should call policyFactory.create to create policy', () => {
      service.create();

      expect(policyFactorySpy.create).to.have.been.called.once;
    });

    it('should return instance of CircuitState', () => {
      expect(service.create()).to.be.instanceOf(CircuitState);
    });

  });

});
