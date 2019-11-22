import { expect } from 'chai';

import { raiseStrategy } from '../../lib/utils';

describe('raiseStrategy', () => {

  it('should throw for wrong strategy option', () => {
    const onError = 'wrong option' as any;
    const expectedMessage = `Option ${onError} is not supported for 'behavior'.`;
    expect(() => raiseStrategy({ onError }, onError)).to.throw(expectedMessage);
  });

  describe('reject', () => {

    const onError = 'reject';

    let strategy: ReturnType<typeof raiseStrategy>;

    beforeEach(() => strategy = raiseStrategy({ onError }, onError));

    it('should return an function', () => expect(strategy).to.be.a('function'));

    it('returned function should ', async () => {
      const message = 'error message';
      await expect(strategy(new Error(message))).to.be.rejectedWith(message);
    });

  });

  describe('throw', () => {

    const onError = 'throw';

    let strategy: ReturnType<typeof raiseStrategy>;

    beforeEach(() => strategy = raiseStrategy({ onError }, onError));

    it('should return an function', () => expect(strategy).to.be.a('function'));

    it('returned function should ', () => {
      const message = 'error message';
      expect(() => strategy(new Error(message))).to.throw(message);
    });

  });

  describe('ignore', () => {

    const onError = 'ignore';

    let strategy: ReturnType<typeof raiseStrategy>;

    beforeEach(() => strategy = raiseStrategy({ onError }, onError));

    it('should return an function', () => expect(strategy).to.be.a('function'));

    it('returned function should ', () => {
      const message = 'error message';
      expect(strategy(new Error(message))).to.be.undefined;
    });

  });

  describe('ignoreAsync', () => {

    const onError = 'ignoreAsync';

    let strategy: ReturnType<typeof raiseStrategy>;

    beforeEach(() => strategy = raiseStrategy({ onError }, onError));

    it('should return an function', () => expect(strategy).to.be.a('function'));

    it('returned function should ', () => {
      const message = 'error message';
      expect(strategy(new Error(message))).to.be.a('promise').and.not.be.rejected;
    });

  });

});
