import { cache } from '../lib/cache/';

class A {
  @cache(300, { scope: 'instance' })
  public f(n: number): boolean {
    for (let i = 2; i <= Math.sqrt(n); i += 1) {
      if (n % i === 0) return false;
    }
    return true;
  }
}

class B {

  @cache(400, { scope: 'class' })
  public g(n: number): number {
    return n ** 2;
  }
}

console.log('a');
const a = new A();
console.log('b');
const b = new A();
console.log(a, b);

a.f(3);
b.f(4);
new B().g(5);
