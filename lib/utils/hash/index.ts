import * as hash from 'object-hash';

export class HashService {

  public calculate(value: any): string {
    return hash(value);
  }

}
