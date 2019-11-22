import { expect } from 'chai';
import * as sinon from 'sinon';

import { CircuitStateFactory } from '../../../lib/circuit/CircuitState/factory';
import {
  ArgumentsCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ArgumentsCircuitStateStorage';
import {
  ClassCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/ClassCircuitStateStorage';
import { CircuitStateStorageFactory } from '../../../lib/circuit/CircuitStateStorage/factory';
import {
  InstanceCircuitStateStorage,
} from '../../../lib/circuit/CircuitStateStorage/InstanceCircuitStateStorage';
import { HashService } from '../../../lib/utils/hash';

describe('@circuit CircuitStateStorageFactory', () => {

  const circuitStateFactoryStub = sinon.createStubInstance(CircuitStateFactory);
  const hashServiceStub = sinon.createStubInstance(HashService);

  describe('constructor', () => {

    it('should create', () => {
      const service = new CircuitStateStorageFactory(
        'class',
        circuitStateFactoryStub as any,
        hashServiceStub,
      );
      expect(service).to.be.instanceOf(CircuitStateStorageFactory);
    });

  });

  describe('create', () => {

    it('should create instance of ArgumentsCircuitStateStorage for "args-hash" argument', () => {
      const service = new CircuitStateStorageFactory(
        'args-hash',
        circuitStateFactoryStub as any,
        hashServiceStub,
      );

      expect(service.create()).to.be.instanceOf(ArgumentsCircuitStateStorage);
    });

    it('should create instance of ClassCircuitStateStorage for "class" argument', () => {
      const service = new CircuitStateStorageFactory(
        'class',
        circuitStateFactoryStub as any,
        hashServiceStub,
      );

      expect(service.create()).to.be.instanceOf(ClassCircuitStateStorage);
    });

    it('should create instance of InstanceCircuitStateStorage for "instance" argument', () => {
      const service = new CircuitStateStorageFactory(
        'instance',
        circuitStateFactoryStub as any,
        hashServiceStub,
      );

      expect(service.create()).to.be.instanceOf(InstanceCircuitStateStorage);
    });

  });

});
