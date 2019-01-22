# micro-decorators

[![Build Status](https://travis-ci.org/labs42io/micro-decorators.svg?branch=develop)](https://travis-ci.org/labs42io/micro-decorators)
[![Coverage Status](https://coveralls.io/repos/github/labs42io/micro-decorators/badge.svg?branch=develop)](https://coveralls.io/github/labs42io/micro-decorators?branch=develop)

Microservice pattern decorators.

```ts
class Service {
  // ensure this method is resolved or rejected within 2 seconds timeout
  @timeout(2000)
  async get() {
    // ...
  }
}
```

**This package is under development.**  
Expected v1.0.0 publish: 2019 Q1

## Roadmap

* Implement first decorators: `cache`, `circuit`, `concurrency`, `retry`, `throttle`, `timeout`.

* Test coverage > 99%

* Publish v1.0.0 npm package.

* Enhance current decorators:

  * Add more configuration options

  * Add support for groups

  * Add support to decorate entire class

  * Add support to configure using custom policies

* Add more decorators

## Installation

Using npm:

```javascript
$ npm install 'micro-decorators' --save
```

## Decorators

### Cache

### Circuit breaker

### Concurrency limiter

### Retry

### Throttle

### Timeout

Specifies how long a method should execute.  
If the specified timeout in milliseconds is exceeded then a `Timeout.` error is thrown.

## License

[MIT](LICENSE)
