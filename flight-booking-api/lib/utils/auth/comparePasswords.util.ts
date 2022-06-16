import { encryptPassword } from './encryptPassword.util';

export const comparePasswords = (password: string, hashedPassword: string) => {
  if (!password) {
    throw new Error('No password to compare.');
  }

  const encryptedPassword = encryptPassword(password);
  return encryptedPassword === hashedPassword;
};
