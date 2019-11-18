import { expect } from 'chai';

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

describe('@circuit CircuitStateStorageFactory', () => {

  describe('constructor', () => {

    it('should create', () => {
      const service = new CircuitStateStorageFactory('class', undefined, undefined);
      expect(service).to.be.instanceOf(CircuitStateStorageFactory, undefined);
    });

  });

  describe('create', () => {

    it('should create instance of ArgumentsCircuitStateStorage for "args-hash" argument', () => {
      const service = new CircuitStateStorageFactory('args-hash', undefined, undefined);

      expect(service.create()).to.be.instanceOf(ArgumentsCircuitStateStorage);
    });

    it('should create instance of ClassCircuitStateStorage for "class" argument', () => {
      const service = new CircuitStateStorageFactory('class', undefined, undefined);

      expect(service.create()).to.be.instanceOf(ClassCircuitStateStorage);
    });

    it('should create instance of InstanceCircuitStateStorage for "instance" argument', () => {
      const service = new CircuitStateStorageFactory('instance', undefined, undefined);

      expect(service.create()).to.be.instanceOf(InstanceCircuitStateStorage);
    });

  });

});
