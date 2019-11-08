import * as hash from 'object-hash';

export class HashService {

  public hash(value: any): string {
    return hash(value, { ignoreUnknown: false });
  }

}
