import { cache } from '../lib/cache';

class A {
  @cache(300)
  public f() {
    return 3;
  }
}

class B {

  @cache(400)
  public g() { }
}

console.log('a');
const a = new A();
console.log('b');
const b = new A();
console.log(a, b);

new B().g();
