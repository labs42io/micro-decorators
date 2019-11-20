import { expect } from 'chai';
import { RetryOptions } from '../../lib';
import { Retryer } from '../../lib/retry/Retryer';

describe('Retryer class', () => {
  let retryer: Retryer;

  describe('when called method is synchrone', () => {
    it('should return result', () => {
      retryer = new Retryer({} as RetryOptions, () => 'Success 42!', {} as any, 3);

      expect(retryer.getResponse()).to.equal('Success 42!');
    });

    it('should throw error with message \'Retry failed\'', () => {
      retryer = new Retryer(
        {} as RetryOptions,
        () => { throw new Error('Failed 42'); },
        {} as any,
        3,
      );

      expect(() => retryer.getResponse()).to.throw('Retry failed.');
    });

    it('should return result if throw\'n error is not filtered as expected', () => {
      retryer = new Retryer(
        { errorFilter: (err: Error) => err.message === 'Error 42.' } as RetryOptions,
        () => { throw new Error('Error.'); },
        {} as any,
        3,
      );

      expect(() => retryer.getResponse()).to.throw('Retry failed.');
    });
  });

  describe('when called method is asynchrone', () => {
    it('should return result', async () => {
      retryer = new Retryer({} as RetryOptions, () => Promise.resolve('Success 42!'), {} as any, 3);
      const response = await retryer.getResponse();

      expect(response).to.equal('Success 42!');
    });

    it('should throw error with message \'Retry failed\'', async () => {
      retryer = new Retryer(
        {} as RetryOptions,
        () => Promise.reject('Failed 42.'),
        {} as any,
        3,
      );

      await expect(retryer.getResponse()).to.eventually.be.rejectedWith('Retry failed.');
    });

    it('should return result if throw\'n error is not filtered as expected', async () => {
      retryer = new Retryer(
        { errorFilter: (err: Error) => err.message === 'Error 42.' } as RetryOptions,
        () => Promise.reject('Error 42.'),
        {} as any,
        3,
      );

      await expect(retryer.getResponse()).to.eventually.be.rejectedWith('Retry failed.');
    });

    describe('when method should wait before retry', () => {
      it('should delay expected time when pattern is of type number', async () => {
        retryer = new Retryer(
          { waitPattern: 400 } as RetryOptions,
          () => Promise.reject('Error 42.'),
          {} as any,
          3,
        );

        const delay = await getFunctionDelay(async () => {
          return await expect(retryer.getResponse()).to.eventually.be.rejectedWith('Retry failed.');
        });

        expect(delay).to.be.approximately(1200, 15);
      });

      it('should delay expected time when pattern is of type function', async () => {
        retryer = new Retryer(
          { waitPattern: () => { return 300; } } as RetryOptions,
          () => Promise.reject('Error 42.'),
          {} as any,
          3,
        );

        const delay = await getFunctionDelay(async () => {
          return await expect(retryer.getResponse()).to.eventually.be.rejectedWith('Retry failed.');
        });

        expect(delay).to.be.approximately(900, 15);
      });
    });
  });
});

async function getFunctionDelay(method: Function): Promise<number> {
  const time = new Date().getTime();

  await method();

  return new Date().getTime() - time;
}
