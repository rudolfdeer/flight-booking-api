import { CRYPTO } from 'lib/constants/auth';
import * as crypto from 'crypto';

export const encryptPassword = (password: string) => {
  if (!password) {
    throw new Error('No data to encrypt.');
  }

  const encryptedPassword = crypto.pbkdf2Sync(
    password,
    CRYPTO.SALT,
    CRYPTO.ITERATIONS,
    CRYPTO.KEYLEN,
    CRYPTO.DIGEST,
  );
  return encryptedPassword.toString('hex');
};
