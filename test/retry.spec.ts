import { expect } from 'chai';
import { retry } from '../lib';

function wait(timeout: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

describe.only('@retry', () => {
  describe('When method is synchrone.', () => {
    describe('When method should return value.', () => {
      describe('When method should work only with attempts number.', () => {
        it('should resolve with expected result and attempts > 0.', () => {
          class TestClass {
            @retry(3)
            test() {
              return 'Success 42.';
            }
          }

          const target = new TestClass();
          const result = target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts = 0.', () => {
          class TestClass {
            @retry(0)
            test() {
              return 'Success 42.';
            }
          }

          const target = new TestClass();
          const result = target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts < 0.', () => {
          class TestClass {
            @retry(-3)
            test() {
              return 'Success 42.';
            }
          }

          const target = new TestClass();
          const result = target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts === null.', () => {
          class TestClass {
            @retry(-3)
            test() {
              return 'Success 42.';
            }
          }

          const target = new TestClass();
          const result = target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts === undefined.', () => {
          class TestClass {
            @retry(undefined)
            test() {
              return 'Success 42.';
            }
          }

          const target = new TestClass();
          const result = target.test();

          expect(result).to.equal('Success 42.');
        });
      });
    });

    describe('When method should throw error.', () => {
      describe('When method should work only with attempts number.', () => {
        it('should reject with expected error and attempts > 0.', () => {
          class TestClass {
            @retry(3)
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should resolve with expected result and attempts = 0.', () => {
          class TestClass {
            @retry(0)
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should reject with expected error and attempts < 0.', () => {
          class TestClass {
            @retry(-3)
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should reject with expected error and attempts === null.', () => {
          class TestClass {
            @retry(-3)
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should reject with expected error and attempts === undefined.', () => {
          class TestClass {
            @retry(undefined)
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });
      });

      describe('When method should return a specific error.', () => {
        it('should throw with expected error.', () => {
          class TestClass {
            @retry(3, { onError: 'throw' })
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should return undefined.', () => {
          class TestClass {
            @retry(3, { onError: 'ignore' })
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();
          const response = target.test();

          expect(response).to.equal(undefined);
        });
      });

      describe('When method should throw for a specific error until attempts completted.', () => {
        it('should throw with expected error.', () => {
          class TestClass {
            @retry(3, { errorFilter: (err: Error) => err.message === 'Error 42.' })
            test() {
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
        });

        it('should throw with default error and throw when error is expected.', () => {
          class TestClass {
            public count = 1;
            @retry(3, {
              errorFilter: (err: Error) => {
                return err.message === 'error';
              },
            })
            test() {
              if (this.count === 2) {
                throw new Error('error');
              }

              this.count += 1;
              throw new Error('Error 42.');
            }
          }

          const target = new TestClass();

          expect(() => target.test()).to.throw('Retry failed.');
          expect(target.count).to.equal(2);
        });
      });
    });
  });

  describe('When method is asynchrone.', () => {
    describe('When method should return value.', () => {
      describe('When method should work only with attempts number.', () => {
        it('should resolve with expected result and attempts > 0.', async () => {
          class TestClass {
            @retry(3)
            async test() {
              return Promise.resolve('Success 42.');
            }
          }

          const target = new TestClass();
          const result = await target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts = 0.', async () => {
          class TestClass {
            @retry(0)
            async test() {
              return Promise.resolve('Success 42.');
            }
          }

          const target = new TestClass();
          const result = await target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts < 0.', async () => {
          class TestClass {
            @retry(-3)
            async test() {
              return Promise.resolve('Success 42.');
            }
          }

          const target = new TestClass();
          const result = await target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts === null.', async () => {
          class TestClass {
            @retry(-3)
            async test() {
              return Promise.resolve('Success 42.');
            }
          }

          const target = new TestClass();
          const result = await target.test();

          expect(result).to.equal('Success 42.');
        });

        it('should resolve with expected result and attempts === undefined.', async () => {
          class TestClass {
            @retry(undefined)
            async test() {
              return Promise.resolve('Success 42.');
            }
          }

          const target = new TestClass();
          const result = await target.test();

          expect(result).to.equal('Success 42.');
        });
      });
    });

    describe('When method should throw error.', () => {
      describe('When method should work only with attempts number.', () => {
        it('should reject with expected error and attempts > 0.', async () => {
          class TestClass {
            @retry(3)
            test() {
              return Promise.reject('Error 42.');
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should resolve with expected result and attempts = 0.', async () => {
          class TestClass {
            @retry(0)
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should reject with expected error and attempts < 0.', async () => {
          class TestClass {
            @retry(-3)
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should reject with expected error and attempts === null.', async () => {
          class TestClass {
            @retry(-3)
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should reject with expected error and attempts === undefined.', async () => {
          class TestClass {
            @retry(undefined)
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        // tslint:disable-next-line:max-line-length
        it('should work if the method fails 2 times and succeeds only on the third time.', async () => {
          class TestClass {
            public count = 1;
            @retry(3)
            async test() {
              if (this.count === 3) {
                return Promise.resolve('Success 42!');
              }

              this.count += 1;
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();
          const response = await target.test();

          expect(response).to.equal('Success 42!');
          expect(target.count).to.equal(3);
        });
      });

      describe('When method should return a specific error.', () => {
        it('should throw with expected error.', async () => {
          class TestClass {
            @retry(3, { onError: 'reject' })
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should return undefined.', async () => {
          class TestClass {
            @retry(3, { onError: 'ignoreAsync' })
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();
          const response = await target.test();

          expect(response).to.equal(undefined);
        });
      });

      // tslint:disable-next-line:max-line-length
      describe('When method should reject for a specific error until attempts completted.', () => {
        it('should throw with expected error.', async () => {
          class TestClass {
            @retry(3, { errorFilter: (err: Error) => err.message === 'Error 42.' })
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
        });

        it('should throw with default error and throw when error is expected.', async () => {
          class TestClass {
            public count = 1;
            @retry(3, {
              errorFilter: (err: Error) => {
                return err.message === 'error';
              },
            })
            async test() {
              if (this.count === 2) {
                return Promise.reject(new Error('error'));
              }

              this.count += 1;
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
          expect(target.count).to.equal(2);
        });
      });

      describe('When method should work correctly with wait pattern', () => {
        it('should wait for a specific time when pattern is number', async () => {
          class TestClass {
            private count = 1;
            private now;
            public times = [];
            @retry(3, {
              waitPattern: 100,
            })
            async test() {
              if (this.count === 1) {
                this.now = new Date().getTime();
              } else {
                const newTime = new Date().getTime() - this.now;

                this.times.push(newTime);
                this.now = new Date().getTime();
              }
              this.count += 1;
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
          target.times.forEach((time) => {
            expect(Math.floor(time / 100) * 100).to.equal(100);
          });
        });

        it('should wait for a specific time when pattern is array of numbers', async () => {
          class TestClass {
            private count = 1;
            private now;
            public times = [];
            @retry(3, {
              waitPattern: [100, 200, 300],
            })
            async test() {
              if (this.count === 1) {
                this.now = new Date().getTime();
              } else {
                const newTime = new Date().getTime() - this.now;

                this.times.push(newTime);
                this.now = new Date().getTime();
              }
              this.count += 1;
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
          target.times.forEach((time, index) => {
            expect(Math.floor(time / 100) * 100).to.equal(100 * (index + 1));
          });
        });

        it('should wait for a specific time when pattern is function', async () => {
          class TestClass {
            private count = 0;
            private now;
            public times = [];
            @retry(3, {
              waitPattern: attempt => attempt * 100,
            })
            async test() {
              if (this.count <= 1) {
                this.now = new Date().getTime();
              } else {
                const newTime = new Date().getTime() - this.now;

                this.times.push(newTime);
                this.now = new Date().getTime();
              }
              this.count += 1;
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          await expect(target.test()).to.eventually.be.rejectedWith('Retry failed.');
          target.times.forEach((time, index) => {
            expect(Math.floor(time / 100) * 100).to.equal(100 * (index + 1));
          });
        });

        it('should reject error if type of wait pattern is wrong', async () => {
          class TestClass {
            public times = [];
            @retry(3, {
              waitPattern: 'wait' as any,
            })
            async test() {
              return Promise.reject(new Error('Error 42.'));
            }
          }

          const target = new TestClass();

          // tslint:disable-next-line:max-line-length
          await expect(target.test()).to.eventually.be.rejectedWith('Option string is not supported for \'waitPattern\'.');
        });
      });
    });
  });
});
