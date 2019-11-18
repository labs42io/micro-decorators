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
      service['circuitState'] = null;

      expect(service.get()).to.equals(expectedResult);
    });

    it('should return existent instance of circuit state if is not first call', () => {
      const instance = service['circuitState'] = {} as any;

      expect(service.get()).to.equals(instance);
    });

    it('should use circuitStateFactory.create to create new instance of CircuitState', () => {
      service['circuitState'] = null;

      service.get();

      expect(circuitStateFactoryStub.create.calledOnce).to.be.true;
    });

    it('should not call circuitStateFactory.create if CircuitState instance already exists', () => {
      service['circuitState'] = {} as any;

      service.get();

      expect(circuitStateFactoryStub.create.calledOnce).to.be.false;
    });

  });

});
