import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { profile } from 'console';
import { Flight } from 'lib/modules/flight/flight.entity';
import { Ticket } from 'lib/modules/ticket/ticket.entity';
import { comparePasswords } from 'lib/utils/auth/comparePasswords.util';
import { Profile } from '../profile.entity';
import { ProfilesService } from '../profile.service';

const user = {
  phone: '+375291111111',
  email: 'test@test.com',
  password:
    'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d',
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
  updatedAt: 'Mon Feb 21 2022 00:54:52 GMT+0300 (Moscow Standard Time)',
  isAdmin: false,
} as Profile;

const validationInfo = {
  email: 'test@test.com',
  rightPassword: 'toma',
  wrongPassword: '123t',
};

const repositoryMock = {
  findOne: jest.fn(() => user),
  save: jest.fn(() => user),
  update: jest.fn(() => user),
  delete: jest.fn(() => 'deleted'),
};

const correctBody = {
  email: 'new@test.com',
  password: 'toma',
} as Profile;

const incorrectBody = {
  email: 'test@test.com',
  password: 'toma',
} as Profile;

describe('profile service', () => {
  let profileService: ProfilesService;
  let module: TestingModule;
  let jwtService: JwtService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
          secret: process.env.TOKEN_SECRET,
          signOptions: { expiresIn: process.env.TOKEN_LIFE },
        }),
      ],
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    profileService = module.get<ProfilesService>(ProfilesService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(profile).toBeDefined();
  });

  describe('validate user', () => {
    it('should return user if success', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => user);

      const result = await profileService.validateUser(
        validationInfo.email,
        validationInfo.rightPassword,
      );

      expect(
        comparePasswords(validationInfo.rightPassword, user.password),
      ).toBe(true);
      expect(result).toBe(user);
    });

    it('should return null if not successful', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);

      const result = await profileService.validateUser(
        validationInfo.email,
        validationInfo.wrongPassword,
      );

      expect(
        comparePasswords(validationInfo.wrongPassword, user.password),
      ).toBe(false);
      expect(result).toBe(null);
    });
  });

  describe('find by id', () => {
    it('should return a user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => user);

      const result = await profileService.findById('1');

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);

      const result = await profileService.findById('7');

      expect(repositoryMock.findOne).toHaveBeenCalledWith('7');
      expect(result).toBe(null);
    });
  });

  describe('sign up', () => {
    it('should return user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);
      jest.spyOn(repositoryMock, 'save').mockImplementation(() => user);
      jest
        .spyOn(profileService, 'findById')
        .mockImplementation(async () => user);

      const result = await profileService.signUp(correctBody);

      expect(result.user).toBe(user);
    });

    it('should throw error if email already exists', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => user);

      try {
        await profileService.signUp(incorrectBody);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('sign in', () => {
    it('should return user', async () => {
      jest.spyOn(jwtService, 'sign').mockImplementation(() => 'token');

      const result = await profileService.signIn(user);

      const resp = {
        access_token: 'token',
        id: user.id,
        isAdmin: user.isAdmin,
      };

      expect(result).toStrictEqual(resp);
    });
  });

  describe('delete', () => {
    it('should return null', async () => {
      jest.spyOn(repositoryMock, 'delete').mockImplementation(() => null);

      const result = await profileService.deleteById(1);

      expect(result).toBe(null);
    });
  });

  describe('update', () => {
    it('should return updated user', async () => {
      jest.spyOn(repositoryMock, 'update').mockImplementation(() => user);

      const result = await profileService.update(user, 1);

      expect(result).toBe(user);
    });
  });
});
