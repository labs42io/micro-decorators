import { expect } from 'chai';
import * as sinon from 'sinon';

import {
  ClassCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ClassCircuitStateStorage';
import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';

describe('@circuit ClassCircuitStateStorage', () => {

  let circuitStateFactoryStub: sinon.SinonStubbedInstance<CircuitStateFactory>;
  let service: ClassCircuitStateStorage;

  beforeEach(() => {
    circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);

    service = new ClassCircuitStateStorage(circuitStateFactoryStub as any);
  });

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ClassCircuitStateStorage));
  });

  describe('get', () => {

    it('should create new instance of circuit state if is first call and return it', () => {
      const expectedResult = {} as any;
      circuitStateFactoryStub.create.returns(expectedResult);

      expect(service.get()).to.equals(expectedResult);
    });

    it('should return existent instance of circuit state if is not first call', () => {
      const instance = {} as any;
      circuitStateFactoryStub.create.returns(instance);

      expect(service.get()).to.equals(instance);
    });

    it('should use circuitStateFactory.create to create new instance of CircuitState', () => {
      service.get();

      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not call circuitStateFactory.create if CircuitState instance already exists', () => {
      const instance = {} as any;
      circuitStateFactoryStub.create.returns(instance);
      service.get();
      circuitStateFactoryStub.create.reset();

      service.get();

      expect(circuitStateFactoryStub.create.calledOnce).to.be.false;
    });

  });

});
