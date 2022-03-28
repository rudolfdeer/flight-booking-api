import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../ticket.entity';
import { TicketModule } from '../ticket.module';
import { TicketsService } from '../ticket.service';
import { Profile } from 'lib/modules/profile/profile.entity';
import { Flight } from 'lib/modules/flight/flight.entity';

const ticket = {
  flightId: 1,
  profileId: 1,
  rank: 'economy',
  price: 120,
  isAvaliable: true,
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
} as Ticket;

const user = {
  id: 1,
  phone: '+375291111111',
  email: 'test@test.com',
  password:
    'bc1f5bc429633f461ce402232164d4e240d53ae7594a105122ce7a8426b6b17b6798f7cd67dd4bf3b33846cc0134217535302e50f06c316f06de6a24dae08d0d',
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
  updatedAt: 'Mon Feb 21 2022 00:54:52 GMT+0300 (Moscow Standard Time)',
  isAdmin: false,
};

describe('tickets', () => {
  let app: INestApplication;
  const ticketsService = {
    getBookedTickets: jest.fn(() => [ticket]),
    findById: jest.fn(() => ticket),
    bookTicket: jest.fn(() => ticket),
    deleteBookedTicket: jest.fn(() => ticket),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Ticket, Profile, Flight]),
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
        TicketModule,
      ],
    })
      .overrideProvider(TicketsService)
      .useValue(ticketsService)

      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = user;
          return true;
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

  describe(`/GET tickets`, () => {
    it('should return array of booked tickets', async () => {
      const response = await request(app.getHttpServer()).get('/tickets');

      expect(ticketsService.getBookedTickets).toHaveBeenCalled;
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(ticketsService.getBookedTickets());
    });
  });

  describe(' /GET tickets/:id', () => {
    it('should find ticket by id', async () => {
      const response = await request(app.getHttpServer()).get('/tickets/1');

      expect(ticketsService.findById).toHaveBeenCalledWith('1');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(ticket);
    });
  });

  describe(' /POST tickets/:id', () => {
    it('should book a ticket with userId', async () => {
      const response = await request(app.getHttpServer()).post('/tickets/1');

      expect(ticketsService.bookTicket).toHaveBeenCalledWith('1', 1);
      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(ticket);
    });
  });

  describe(' /DELETE tickets/:id', () => {
    it('should unbook ticket', async () => {
      const response = await request(app.getHttpServer()).delete('/tickets/1');

      expect(ticketsService.deleteBookedTicket).toHaveBeenCalledWith('1', 1);
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(ticket);
    });
  });
});
