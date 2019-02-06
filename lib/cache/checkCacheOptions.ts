import { CacheOptions } from '.';

export function checkCacheOptions(options: CacheOptions): void {
  checkScope(options.scope);
  checkStorage(options.storage);
  checkExpirationType(options.expiration);
}

const admisibleScopes = ['class', 'instance'];
const admisibleStorages = ['memory'];
const admisibleExpirations = ['absolute', 'sliding'];

function checkScope(scope: 'class' | 'instance'): void {
  if (isNotAdmisibleValue(scope, admisibleScopes)) {
    throw new Error(`Option ${scope} is not supported for 'scope'.`);
  }
}

function checkStorage(storage: 'memory'): void {
  if (isNotAdmisibleValue(storage, admisibleStorages)) {
    throw new Error(`Option ${storage} is not supported for 'storage'.`);
  }
}

function checkExpirationType(expiration: 'absolute' | 'sliding'): void {
  if (isNotAdmisibleValue(expiration, admisibleExpirations)) {
    throw new Error(`Option ${expiration} is not supported for 'expiration'.`);
  }
}

function isNotAdmisibleValue(value: string, admisibleValues: string[]): boolean {
  return value && admisibleValues.every(type => type !== value);
}
