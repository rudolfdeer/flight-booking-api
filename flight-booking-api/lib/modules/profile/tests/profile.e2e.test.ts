import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from 'lib/modules/flight/flight.entity';
import { Ticket } from 'lib/modules/ticket/ticket.entity';
import { Profile } from '../profile.entity';
import { ProfileModule } from '../profile.module';
import { ProfilesService } from '../profile.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

const user = {
  phone: '+375291111111',
  email: 'test@test.com',
  password:
    'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d',
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
  updatedAt: 'Mon Feb 21 2022 00:54:52 GMT+0300 (Moscow Standard Time)',
  isAdmin: false,
} as Profile;

const requestBody = {
  email: 'test@test.com',
  password: 'toma',
  phone: '+375291111111',
};

const body = {
  email: 'test@test.com',
  password: 'toma',
};

const profileService = {
  validate: jest.fn(() => user),
  findById: jest.fn(() => user),
  signUp: jest.fn(() => ({
    id: 1,
    access_token: 'token',
    user: user,
  })),
  signIn: jest.fn(() => user),
  update: jest.fn(() => user),
  deleteById: jest.fn(() => null),
};

const jwtService = {
  sign: jest.fn(() => 'token'),
};

describe('profile', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Profile, Flight, Ticket]),
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
        ProfileModule,
      ],
    })
      .overrideProvider(ProfilesService)
      .useValue(profileService)
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return true;
        },
      })
      .overrideGuard(AuthGuard('local'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return user;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  describe(' /POST profile/sign-up', () => {
    it('should call signUp method and return new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/profile/sign-up')
        .send(requestBody);

      expect(profileService.signUp).toHaveBeenCalledWith(requestBody);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(user);
    });
  });

  describe(' /POST profile/sign-in', () => {
    it('should call signIn method and return user', async () => {
      const response = await request(app.getHttpServer())
        .post('/profile/sign-in')
        .send(body);

      expect(profileService.signIn).toHaveBeenCalledWith(user);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(user);
    });
  });

  describe(' /DELETE profile/sign-out', () => {
    it('should return null', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/profile/sign-out',
      );

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });

  describe(' /PUT profile/', () => {
    it('should call update method and return updated user', async () => {
      const response = await request(app.getHttpServer())
        .put('/profile')
        .send(user);

      expect(profileService.update).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(user);
    });
  });

  describe(' /DELETE profile/', () => {
    it('should call deleteById method and return null', async () => {
      const response = await request(app.getHttpServer()).delete('/profile');

      expect(profileService.deleteById).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({});
    });
  });
});
