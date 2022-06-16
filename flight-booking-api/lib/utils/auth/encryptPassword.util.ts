import * as crypto from 'crypto';

export const encryptPassword = (password: string) => {
  if (!password) {
    throw new Error('No data to encrypt.');
  }

  const encryptedPassword = crypto.pbkdf2Sync(
    password,
    process.env.CRYPTO_SALT,
    parseInt(process.env.CRYPTO_ITERATIONS),
    parseInt(process.env.CRYPTO_KEYLEN),
    process.env.CRYPTO_DIGEST,
  );
  return encryptedPassword.toString('hex');
};
