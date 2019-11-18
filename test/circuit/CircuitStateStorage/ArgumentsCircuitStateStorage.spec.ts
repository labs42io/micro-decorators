import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';
import {
  ArgumentsCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ArgumentsCircuitStateStorage';
import { HashService } from '../../../lib/utils/hash';

describe('@circuit ArgumentsCircuitStateStorage', () => {

  let circuitStateFactoryStub: sinon.SinonStubbedInstance<CircuitStateFactory>;
  const hashedKey = 'key';
  let hashServiceStub: sinon.SinonStubbedInstance<HashService>;
  let service: ArgumentsCircuitStateStorage;

  beforeEach(() => {
    circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);
    hashServiceStub = sinon.createStubInstance(HashService);
    hashServiceStub.calculate.returns(hashedKey);

    service = new ArgumentsCircuitStateStorage(circuitStateFactoryStub as any, hashServiceStub);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ArgumentsCircuitStateStorage));

    it('should init instancesStorage property', () => {
      expect(service['argumentsStorage']).to.be.instanceOf(Map);
    });

  });

  describe('get', () => {

    it('should create CircuitState if is called first time for current arguments', () => {
      const args = {} as any;

      service['argumentsStorage'].set({ 4: 2 } as any, undefined);
      const expected = {} as any;
      circuitStateFactoryStub.create.returns(expected);

      expect(service.get(args)).to.be.equals(expected);
      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should use hashService to calculate arugments hash', () => {
      const expected = {} as any;
      const args = {} as any;
      circuitStateFactoryStub.create.returns(expected);

      service.get(args);

      expect(service['argumentsStorage'].get(hashedKey)).to.be.equals(expected);
      expect(hashServiceStub.calculate.calledOnce).to.be.true;
    });

    it('should use create CircuitState if is called not first time for current arguments', () => {
      const expected = {} as any;
      const args = {} as any;
      service['argumentsStorage'].set(hashedKey, expected);

      expect(service.get(args)).to.be.equals(expected);
      expect(circuitStateFactoryStub.create.called).to.be.false;
    });

  });

});
