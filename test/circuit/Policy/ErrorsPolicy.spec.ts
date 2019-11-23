import { expect } from 'chai';

import { ErrorsPolicy } from '../../../lib/circuit/Policy/ErrorsPolicy';
import { repeat } from '../../utils';

describe('@circuit ErrorsPolicy', () => {

  const threshold = 3;
  let service: ErrorsPolicy;

  beforeEach(() => service = new ErrorsPolicy(threshold));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(ErrorsPolicy));

  });

  describe('registerCall', () => {

    it('should increase number of errors with 1 if is error', () => {
      repeat(() => service.registerCall('error'), threshold);

      expect(service.allowExecution()).to.be.false;
    });

    it('should not increase number of errors if is success execution', () => {
      repeat(() => service.registerCall('success'), threshold);

      expect(service.allowExecution()).to.be.true;
    });

    it('should return self instance', () => {
      expect(service.registerCall('success')).to.be.equals(service);
    });

  });

  describe('deleteCallData', () => {

    it('should decrease number of errors with 1 if is error', () => {
      repeat(() => service.registerCall('error'), threshold);

      service.deleteCallData('error');

      expect(service.allowExecution()).to.be.true;
    });

    it('should not decrease number of errors if is success execution', () => {
      repeat(() => service.registerCall('error'), threshold);

      service.deleteCallData('success');

      expect(service.allowExecution()).to.be.false;
    });

    it('should return self instance', () => {
      expect(service.deleteCallData('success')).to.be.equals(service);
    });

  });

  describe('reset', () => {

    it('should set number of errors to 0', () => {
      repeat(() => service.registerCall('error'), threshold);

      service.reset();

      expect(service.allowExecution()).to.be.true;
    });

    it('should return self instance', () => {
      expect(service.reset()).to.be.instanceOf(ErrorsPolicy);
    });

  });

  describe('allowExecution', () => {

    it('should return true if number of errors is less than threshold', () => {
      repeat(() => service.registerCall('error'), threshold - 1);

      expect(service.allowExecution()).to.be.true;
    });

    it('should return false if number of errors is equals with threshold', () => {
      repeat(() => service.registerCall('error'), threshold);

      expect(service.allowExecution()).to.be.false;
    });

    it('should return false if number of errors is greater than threshold', () => {
      repeat(() => service.registerCall('error'), threshold + 1);

      expect(service.allowExecution()).to.be.false;
    });

  });

});
