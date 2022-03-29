import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from 'lib/modules/flight/flight.entity';
import { Ticket } from 'lib/modules/ticket/ticket.entity';
import { ProfileController } from '../profile.controller';
import { Profile } from '../profile.entity';
import { ProfilesService } from '../profile.service';
import * as Cookies from 'js-cookie';
import * as mocks from 'node-mocks-http';
import EventEmitter from 'events';
import { Response } from 'express';

const user = {
  id: 1,
  phone: '+375291111111',
  email: 'test@test.com',
  password:
    'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d',
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
  updatedAt: 'Mon Feb 21 2022 00:54:52 GMT+0300 (Moscow Standard Time)',
  isAdmin: false,
  bookedTickets: [],
} as Profile;

const response = {
  id: 1,
  access_token: '123abc',
  user: user,
};

const signInResponse = {
  id: 1,
  access_token: '123abc',
  isAdmin: false,
};

const body = {
  email: 'test@test.com',
  password: 'toma',
} as Profile;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(null);
  return res;
};

describe('profile controller', () => {
  let profileController: ProfileController;
  let profileService: ProfilesService;
  let module: TestingModule;
  let res: Response;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Profile, Ticket, Flight]),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: '127.0.0.1',
          port: 5432,
          username: 'postgres',
          password: '123',
          database: 'flights',
          autoLoadEntities: true,
          synchronize: true,
        }),
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
          secret: process.env.TOKEN_SECRET,
          signOptions: { expiresIn: process.env.TOKEN_LIFE },
        }),
      ],
      controllers: [ProfileController],
      providers: [ProfilesService],
    }).compile();

    profileService = module.get<ProfilesService>(ProfilesService);
    profileController = module.get<ProfileController>(ProfileController);

    res = mockResponse();
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  describe('sign up', () => {
    it('should return signed up user if success', async () => {
      jest
        .spyOn(profileService, 'signUp')
        .mockImplementation(async () => response);

      const result = await profileController.signUp(body, res);

      expect(result).toBe(user);
    });
  });

  describe('sign in', () => {
    it('should return response if success', async () => {
      jest
        .spyOn(profileService, 'signIn')
        .mockImplementation(async () => signInResponse);

      const result = await profileController.signIn(body, res);

      expect(result).toBe(signInResponse);
    });

    it('should set cookie', async () => {
      jest.spyOn(Cookies, 'get').mockImplementation(() => ({
        jwt: response.access_token,
      }));

      await profileController.signIn(body, res);

      const cookie = Cookies.get().jwt;

      expect(cookie).toBe(response.access_token);
    });
  });

  describe('sign out', () => {
    it('should return null', async () => {
      const result = await profileController.signOut(res);

      expect(result).toBe(null);
    });

    it('should delete cookie', async () => {
      jest.spyOn(Cookies, 'get').mockImplementation(() => null);

      await profileController.signOut(res);

      const cookie = Cookies.get();

      expect(cookie).toBe(null);
    });
  });

  describe('update', () => {
    it('should return updated user', async () => {
      jest.spyOn(profileService, 'update').mockImplementation(async () => user);

      const result = await profileController.update(1, user);

      expect(result).toBe(user);
    });
  });

  describe('delete', () => {
    it('should return null', async () => {
      jest
        .spyOn(profileService, 'deleteById')
        .mockImplementation(async () => null);

      const result = await profileController.deleteById(1, res);

      expect(result).toBe(null);
    });

    it('should delete cookie', async () => {
      jest.spyOn(Cookies, 'get').mockImplementation(() => null);

      await profileController.deleteById(1, res);

      const cookie = Cookies.get();

      expect(cookie).toBe(null);
    });
  });
});
