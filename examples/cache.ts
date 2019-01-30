import { cache } from '../lib/cache';

class A {
  @cache(300, { scope: 'instance' })
  public f() {
    return 3;
  }
}

class B {

  @cache(400, { scope: 'class' })
  public g() { }
}

console.log('a');
const a = new A();
console.log('b');
const b = new A();
console.log(a, b);

a.f();
b.f();
new B().g();
