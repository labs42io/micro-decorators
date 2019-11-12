import { circuit } from '../lib';

class Service {

  private executionIndex = 0;

  @circuit(2, 1000)
  public get() {
    if (this.executionIndex < 2) {
      this.executionIndex += 1;
      throw new Error('Something went wrong');
    }

    return 42;
  }

}

async function main() {
  const service = new Service();

  try {
    service.get();
  } catch (error) {
    console.log(error.message); // function throws error
  }
  try {
    service.get();
  } catch (error) {
    console.log(error.message); // function throws error
  }
  try {
    service.get();
  } catch (error) {
    console.log(error.message); // decorator throws error
  }

  await new Promise(resolve => setTimeout(
    () => resolve(),
    1000,
  ));
  console.log(service.get()); // prints: 42
}

main();
