import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { comparePasswords } from './comparePasswords.util';
import { encryptPassword } from './encryptPassword.util';

const password = 'toma';
const correctHashedPassword =
  'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d';
const incorrectHashedPassword = '123';

describe('auth utils', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  describe('compare passwords util', () => {
    it('should return false if passwords dont match', () => {
      const result = comparePasswords(password, incorrectHashedPassword);
      expect(result).toBe(false);
    });

    it('should return true if passwords match', () => {
      const result = comparePasswords(password, correctHashedPassword);
      expect(result).toBe(true);
    });

    it('should throw error if no password provided', () => {
      try {
        comparePasswords(null, correctHashedPassword);
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('No password to compare.');
      }
    });
  });

  describe('encrypt password util', () => {
    it('should return encrypted password', () => {
      const result = encryptPassword(password);
      expect(result).toBe(correctHashedPassword);
    });

    it('should throw error if no password provided', () => {
      try {
        encryptPassword(null);
      } catch (e) {
        expect(e).toBeTruthy();
        expect(e.message).toBe('No data to encrypt.');
      }
    });
  })
});
