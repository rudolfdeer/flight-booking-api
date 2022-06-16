import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from 'lib/modules/flight/flight.entity';
import { Profile } from 'lib/modules/profile/profile.entity';
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

const repositoryMock = {
  find: jest.fn(() => [ticket]),
  findOne: jest.fn(() => ticket),
  save: jest.fn(() => ticket),
  update: jest.fn(() => ticket),
  delete: jest.fn(() => 'deleted'),
};

describe('ticket service', () => {
  let ticketService: TicketsService;
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
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    ticketService = module.get<TicketsService>(TicketsService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(ticketService).toBeDefined();
  });

  describe('find by id', () => {
    it('should return a ticket with corresponding id', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => ticket);

      const result = await ticketService.findById('1');

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(ticket);
    });
  });

  describe('get booked tickets', () => {
    it('should return users booked tickets', async () => {
      jest.spyOn(repositoryMock, 'find').mockImplementation(() => [ticket]);

      const result = await ticketService.getBookedTickets(1);

      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(repositoryMock.find).toHaveBeenCalledWith({ profileId: 1 });
      expect(result).toStrictEqual([ticket]);
    });
  });

  describe('book ticket', () => {
    it('should return booked ticket', async () => {
      const avaliableTicket = { ...ticket, isAvaliable: true };
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementation(() => avaliableTicket);
      jest.spyOn(repositoryMock, 'update').mockImplementation(() => ticket);

      const result = await ticketService.bookTicket('1', 1);

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(repositoryMock.update).toHaveBeenCalledTimes(1);
      expect(repositoryMock.update).toHaveBeenCalledWith('1', {
        profileId: 1,
        isAvaliable: false,
      });
      expect(result).toStrictEqual(avaliableTicket);
    });

    it('should return message if ticket is already booked', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => ticket);

      const result = await ticketService.bookTicket('1', 1);

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.update).toHaveBeenCalledTimes(0);
      expect(result).toBe('this ticket is already booked by other user');
    });
  });

  describe('delete booked ticket', () => {
    it('should return unbooked ticket', async () => {
      jest.spyOn(repositoryMock, 'update').mockImplementation(() => ticket);

      const result = await ticketService.deleteBookedTicket('1', 1);

      expect(repositoryMock.findOne).toHaveBeenCalled();
      expect(repositoryMock.update).toHaveBeenCalledTimes(1);
      expect(repositoryMock.update).toHaveBeenCalledWith('1', {
        isAvaliable: true,
        profileId: null,
      });
      expect(result).toStrictEqual(ticket);
    });

    it('should return message if ticket was booked by other user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => ticket);

      const result = await ticketService.deleteBookedTicket('1', 2);

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.update).toHaveBeenCalledTimes(0);
      expect(result).toBe('this ticket was booked by other user');
    });
  });
});
