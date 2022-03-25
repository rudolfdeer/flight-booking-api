import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from 'lib/modules/flight/flight.entity';
import { Profile } from 'lib/modules/profile/profile.entity';
import { TicketsController } from '../ticket.controller';
import { Ticket } from '../ticket.entity';
import { TicketsService } from '../ticket.service';

const ticket = {
  flightId: 1,
  profileId: 1,
  rank: 'economy',
  price: 120,
  isAvaliable: false,
  createdAt: 'Tue Aug 31 2021 00:35:45 GMT+0300 (Moscow Standard Time)',
} as Ticket;

describe('tickets controller', () => {
  let ticketsController: TicketsController;
  let ticketsService: TicketsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
      ],
      controllers: [TicketsController],
      providers: [TicketsService],
    }).compile();

    ticketsService = module.get<TicketsService>(TicketsService);
    ticketsController = module.get<TicketsController>(TicketsController);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  describe('get booked tickets', () => {
    it('should return an array of users booked tickets', async () => {
      const result = [ticket] as Ticket[];

      jest
        .spyOn(ticketsService, 'getBookedTickets')
        .mockImplementation(async () => result);

      const response = await ticketsController.getBookedTickets(1);

      expect(response).toBe(result);
    });
  });

  describe('get ticket', () => {
    it('should return a ticket with corresponding id', async () => {
      jest
        .spyOn(ticketsService, 'findById')
        .mockImplementation(async () => ticket);

      const response = await ticketsController.getTicket('1');

      expect(response).toBe(ticket);
    });
  });

  describe('book ticket', () => {
    it('should return booked ticket', async () => {
      jest
        .spyOn(ticketsService, 'bookTicket')
        .mockImplementation(async () => ticket);

      const response = await ticketsController.bookTicket(1, '1');

      expect(response).toBe(ticket);
    });
  });

  describe('delete booked ticket', () => {
    it('should return unbooked ticket', async () => {
      jest
        .spyOn(ticketsService, 'deleteBookedTicket')
        .mockImplementation(async () => ticket);

      const response = await ticketsController.deleteBookedTicket(1, '1');

      expect(response).toBe(ticket);
    });
  });
});
