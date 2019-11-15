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

    it('should init instancesStorage property', () => {
      expect(service['instancesStorage']).to.be.instanceOf(WeakMap);
    });

  });

  describe('get', () => {

    it('should create CircuitState if is called first time for current instance', () => {
      service['instancesStorage'].set({} as any, undefined);
      const expected = {} as any;
      circuitStateFactoryStub.create.returns(expected);

      expect(service.get(undefined, {} as any)).to.be.equals(expected);
      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should use create CircuitState if is called not first time for current instance', () => {
      const expected = {} as any;
      const instance = {} as any;
      service['instancesStorage'].set(instance, expected);

      expect(service.get([], instance)).to.be.equals(expected);
      expect(circuitStateFactoryStub.create.called).to.be.false;
    });

  });

});
