import { CacheOptions } from '.';

export function checkOptions(options: CacheOptions): void {
  checkScope(options.scope);
  checkStorage(options.storage);
  checkExpirationType(options.expiration);
}

const admisibleScopes = ['class', 'instance'];
const admisibleStorages = ['memory'];
const admisibleExpirations = ['absolute', 'sliding'];

function checkScope(scope: 'class' | 'instance'): void {
  if (!isAdmisibleValue(scope, admisibleScopes)) {
    throw new Error(`Option ${scope} is not supported for 'scope'.`);
  }
}

function checkStorage(storage: 'memory'): void {
  if (!isAdmisibleValue(storage, admisibleStorages)) {
    throw new Error(`Option ${storage} is not supported for 'storage'.`);
  }
}

function checkExpirationType(expiration: 'absolute' | 'sliding'): void {
  if (!isAdmisibleValue(expiration, admisibleExpirations)) {
    throw new Error(`Option ${expiration} is not supported for 'expiration'.`);
  }
}

function isAdmisibleValue(value: string, admisibleValues: string[]): boolean {
  return !value || admisibleValues.some(type => type === value);
}
