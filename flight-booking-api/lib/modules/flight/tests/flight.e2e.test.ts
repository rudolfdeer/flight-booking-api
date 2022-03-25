import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { FlightModule } from '../flight.module';
import { FlightsService } from '../flight.service';
import { Flight } from '../flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'lib/app.module';
import { ProfileModule } from 'lib/modules/profile/profile.module';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'lib/utils/guards/admin.guard';

const flight = {
  id: 1,
  date: '2022-10-11',
  time: '21:34',
  departurePoint: 'MSQ',
  destinationPoint: 'CDG ',
  priceEconomy: 120,
  priceBusiness: 185,
  priceDeluxe: 220,
  totalTicketsEconomy: 123,
  totalTicketsBusiness: 41,
  totalTicketsDeluxe: 18,
  avaliableTicketsEconomy: 122,
  avaliableTicketsBusiness: 40,
  avaliableTicketsDeluxe: 18,
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
} as Flight;

const user = {
  phone: '+375291111111',
  email: 'test@test.com',
  password:
    'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d',
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
  updatedAt: 'Mon Feb 21 2022 00:54:52 GMT+0300 (Moscow Standard Time)',
  isAdmin: false,
};

describe('flights', () => {
  let app: INestApplication;
  const flightService = {
    findAll: jest.fn(() => [flight]),
    findById: jest.fn(() => flight),
    create: jest.fn((flight: Flight) => flight),
    update: jest.fn((flight: Flight) => flight),
    delete: jest.fn(() => 'deleted'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Flight]),
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
        FlightModule,
      ],
    })
      .overrideProvider(FlightsService)
      .useValue(flightService)

      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return true;
        },
      })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`/GET flights`, () => {
    it('should call findAll method', async () => {
      const response = await request(app.getHttpServer()).get('/flights');

      expect(flightService.findAll).toHaveBeenCalled;
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(flightService.findAll());
    });
  });

  describe(' /GET flights/:id', () => {
    it('should call findById method', async () => {
      const response = await request(app.getHttpServer()).get('/flights/1');

      expect(flightService.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(flight);
    });
  });

  describe(' /POST flights', () => {
    it('should call create method', async () => {
      const response = await request(app.getHttpServer())
        .post('/flights')
        .send(flight);

      expect(flightService.create).toHaveBeenCalledWith(flight);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(flight);
    });
  });

  describe(' /PUT flights/:id', () => {
    it('should call update method', async () => {
      const response = await request(app.getHttpServer())
        .put('/flights/1')
        .send(flight);

      expect(flightService.update).toHaveBeenCalledWith(flight, '1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(flight);
    });
  });

  describe(' /DELETE flights/:id', () => {
    it('should call delete method', async () => {
      const response = await request(app.getHttpServer()).delete('/flights/1');

      expect(flightService.delete).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.text).toBe('deleted');
    });
  });
});
