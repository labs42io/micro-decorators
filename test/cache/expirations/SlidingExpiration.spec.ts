import { expect } from 'chai';
import * as sinon from 'sinon';

import { SlidingExpiration } from '../../../lib/cache/expirations/SlidingExpiration';
import { delay } from '../../utils';

describe('@cache SlidingExpiration', () => {

  const timeout = 10;
  let service: SlidingExpiration;

  beforeEach(() => service = new SlidingExpiration(timeout));

  describe('constructor', () => {

    it('should create', () => expect(service).to.be.instanceOf(SlidingExpiration));

  });

  describe('add', () => {

    describe('new key', () => {

      it('should call clearCallback after timeout ms', async () => {
        const spy = sinon.spy();

        service.add('key', spy);
        await delay(timeout);

        expect(spy.calledOnce).to.be.true;
      });

      it('should call clearCallback with given key', async () => {
        const spy = sinon.spy();

        service.add('key', spy);
        await delay(timeout);

        expect(spy.calledWith('key')).to.be.true;
      });

    });

    describe('existing key', () => {

      it('should remove existing expiration', async () => {
        const expirationSpy = sinon.spy();
        service.add('key', expirationSpy);

        service.add('key', () => { });

        await delay(timeout);

        expect(expirationSpy.called).to.be.false;
      });

      it('should call clearCallback after timeout ms', async () => {
        const spy = sinon.spy();
        service.add('key', () => { });

        service.add('key', spy);

        await delay(timeout);

        expect(spy.calledOnce).to.be.true;
      });

      it('should call clearCallback with given key', async () => {
        const spy = sinon.spy();
        service.add('key', () => { });

        service.add('key', spy);

        await delay(timeout);

        expect(spy.calledWith('key')).to.be.true;
      });

    });

  });

});
