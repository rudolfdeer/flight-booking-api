import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { FlightModule } from '../flight.module';
import { FlightsService } from '../flight.service';
import { Flight } from '../flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'lib/app.module';
import { ProfileModule } from 'lib/modules/profile/profile.module';

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

describe('flights', () => {
  let app: INestApplication;
  const flightService = {
    findAll: () => [flight],
    findById: () => flight,
    create: (flight: Flight) => flight,
    update: (flight: Flight) => flight,
    delete: () => 'deleted',
  };

  beforeAll(async () => {
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
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`/GET flights`, () => {
    it('should return 401 error if user is not authenticated', () => {
      return request(app.getHttpServer())
        .get('/flights')
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should call findAll method', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/profile/sign-in')
        .send({ email: 'test@test.com', password: 'toma' })
        .expect(201);
      const { jwt } = loginResponse.body;

      await request(app.getHttpServer())
        .get('/flights')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200)
        .expect({
          data: flightService.findAll(),
        });
    });
  });
});
