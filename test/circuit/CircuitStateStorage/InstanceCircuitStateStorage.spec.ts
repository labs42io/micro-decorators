import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  InstanceCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/InstanceCircuitStateStorage';
import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';

describe('@circuit InstanceCircuitStateStorage', () => {

  let circuitStateFactoryStub: sinon.SinonStubbedInstance<CircuitStateFactory>;
  let service: InstanceCircuitStateStorage;

  beforeEach(() => {
    circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);

    service = new InstanceCircuitStateStorage(circuitStateFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(InstanceCircuitStateStorage));

  });

  describe('get', () => {

    it('should create CircuitState if is called first time for current instance', () => {
      service['instancesStorage'].set({} as any, undefined);
      const expected = {} as any;
      circuitStateFactoryStub.create.returns(expected);

      expect(service.get(undefined, {} as any)).to.equals(expected);
    });

    it('should use create CircuitState if is called not first time for current instance', () => {
      const expected = {} as any;
      const instance = {} as any;
      service['instancesStorage'].set(instance, expected);

      expect(service.get([], instance)).to.equals(expected);
    });

    it('should use circuitStateFactory.create to create new instance', () => {
      service.get(undefined, {} as any);

      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not use circuitStateFactory.create if correct instance already exists', () => {
      const instance = {} as any;
      service['instancesStorage'].set(instance, {} as any);

      service.get(undefined, instance);

      expect(circuitStateFactoryStub.create.calledOnce).to.be.false;
    });

  });

});
