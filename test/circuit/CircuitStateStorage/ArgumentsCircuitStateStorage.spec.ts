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

  });

  describe('get', () => {

    it('should use circuitStateFactory.create to create CircuitState instance', () => {
      service.get([]);

      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not create new instance of CircuitState if have one for current arguments', () => {
      circuitStateFactoryStub.create.returns({} as any);
      service.get([]);
      circuitStateFactoryStub.create.reset();

      service.get([]);

      expect(circuitStateFactoryStub.create.called).to.be.false;
    });

    it('should create CircuitState if is called first time for current arguments', () => {
      const args = [];

      circuitStateFactoryStub.create.returns({} as any);
      service.get([{ some: 'arguments' }]);
      hashServiceStub.calculate.returns('another hash');

      const expected = {} as any;
      circuitStateFactoryStub.create.returns(expected);

      expect(service.get(args)).to.equals(expected);
    });

    it('should use hashService to calculate arugments hash', () => {
      service.get([]);

      expect(hashServiceStub.calculate.calledOnce).to.be.true;
    });

    it('should call hashService.calculate with correct arguments', () => {
      const args = [{ some: 'arguments' }];

      service.get(args);

      expect(hashServiceStub.calculate.calledWithExactly(args)).to.be.true;
    });

    it('should use create CircuitState if is called not first time for current arguments', () => {
      const expected = {} as any;
      const args = [];
      circuitStateFactoryStub.create.returns(expected);
      service.get(args);
      circuitStateFactoryStub.create.returns(null);

      expect(service.get(args)).to.equals(expected);
    });

  });

});
