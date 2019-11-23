import { expect } from 'chai';

import { RatePolicy } from '../../../lib/circuit/Policy/RatePolicy';
import { repeat } from '../../utils';

describe('@circuit RatePolicy', () => {

  const threshold = 0.6;
  let service: RatePolicy;

  beforeEach(() => service = new RatePolicy(threshold));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(RatePolicy));

  });

  describe('registerCall', () => {

    it('should increase number of errors with 1 if is error', () => {
      service.registerCall('error');

      expect(service.allowExecution()).to.be.false;
    });

    it('should not increase number of errors if is success execution', () => {
      service.registerCall('success');

      expect(service.allowExecution()).to.be.true;
    });

    it('should increase total calls with 1 if is error', () => {
      service.registerCall('success').registerCall('success');

      service.registerCall('error');

      expect(service.allowExecution()).to.be.true;
    });

    it('should increase total calls with 1 if is success execution', () => {
      service.registerCall('error').registerCall('success');

      expect(service.allowExecution()).to.be.true;
    });

    it('should return self instance', () => {
      expect(service.registerCall('success')).to.be.equals(service);
    });

  });

  describe('deleteCallData', () => {

    it('should decrease number of errors with 1 if is error', () => {
      service.registerCall('error');

      service.deleteCallData('error');

      expect(service.allowExecution()).to.be.true;
    });

    it('should not decrease number of errors if is success execution', () => {
      service.registerCall('success').registerCall('error');

      service.deleteCallData('success');

      expect(service.allowExecution()).to.be.false;
    });

    it('should decrease total calls with 1 if is error', () => {
      service.registerCall('error').registerCall('error').registerCall('success');

      service.deleteCallData('error');

      expect(service.allowExecution()).to.be.true;
    });

    it('should decrease total calls with 1 if is success execution', () => {
      service.registerCall('success').registerCall('error');

      service.deleteCallData('success');

      expect(service.allowExecution()).to.be.false;
    });

    it('should return self instance', () => {
      expect(service.deleteCallData('success')).to.be.equals(service);
    });

  });

  describe('reset', () => {

    it('should set number of errors to 0', () => {
      service.registerCall('error');

      service.reset();

      expect(service.allowExecution()).to.be.true;
    });

    it('should set number of totalCalls to 0', () => {
      service.registerCall('error');

      service.reset();

      expect(service.allowExecution()).to.be.true;
    });

    it('should return self instance', () => {
      expect(service.reset()).to.be.equals(service);
    });

  });

  describe('allowExecution', () => {

    it('should return true if number of errors / total calls is less than threshold', () => {
      service.registerCall('success').registerCall('error');

      expect(service.allowExecution()).to.equals(true);
    });

    it('should return false if number of errors is equals with threshold', () => {
      repeat(() => service.registerCall('success'), 2);
      repeat(() => service.registerCall('error'), 3);

      expect(service.allowExecution()).to.equals(false);
    });

    it('should return false if number of errors is greater than threshold', () => {
      service.registerCall('error');

      expect(service.allowExecution()).to.equals(false);
    });

  });

});
