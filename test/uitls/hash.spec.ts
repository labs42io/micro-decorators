import { expect } from 'chai';
import { HashService } from '../../lib/utils/hash';

describe('HashService', () => {

  let service: HashService;

  beforeEach(() => service = new HashService());

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(HashService));

  });

  describe('calculate', () => {

    it('should return string', () => expect(service.calculate({})).to.be.a('string'));

    it('should return same hash for different objects with same values', () => {
      const firstObject = { a: 1, b: { x: 3 }, c: [] };
      const secondObject = { a: 1, b: { x: 3 }, c: [] };

      expect(service.calculate(firstObject)).to.equals(service.calculate(secondObject));
    });

    it('should not deppend on keys order', () => {
      const firstObject = { a: 1, b: 2 };
      const secondObject = { b: 2, a: 1 };

      expect(service.calculate(firstObject)).to.equals(service.calculate(secondObject));
    });

    it('should return different hash for objects with different keys', () => {
      const firstObject = { a: 1 };
      const secondObject = { b: 1 };

      expect(service.calculate(firstObject)).not.equals(service.calculate(secondObject));
    });

    it('should return different hash for objects with different values', () => {
      const firstObject = [1];
      const secondObject = [2];

      expect(service.calculate(firstObject)).not.equals(service.calculate(secondObject));
    });

    it('should return different hash for object with different key/value pairs', () => {
      const firstObject = { a: 1 };
      const secondObject = { b: 2 };

      expect(service.calculate(firstObject)).not.equals(service.calculate(secondObject));
    });

    it('should return same keys for objects what are deep equals', () => {
      const firstArray = [{ a: 1 }];
      const secondArray = [{ a: 1 }];

      expect(service.calculate(firstArray)).to.equals(service.calculate(secondArray));
    });

    it('should return different keys for objects with different keys at more deep level', () => {
      const firstArray = [{ a: 1 }];
      const secondArray = [{ b: 1 }];

      expect(service.calculate(firstArray)).not.equals(service.calculate(secondArray));
    });

  });

});
