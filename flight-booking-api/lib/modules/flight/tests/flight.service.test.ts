import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from '../flight.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from '../flight.entity';

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

const repositoryMock = {
  find: jest.fn(() => [flight]),
  findOne: jest.fn(() => flight),
  save: jest.fn(() => flight),
  update: jest.fn(() => flight),
  delete: jest.fn(() => 'deleted'),
};

describe('flight service', () => {
  let flightService: FlightsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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
      ],
      providers: [
        FlightsService,
        {
          provide: getRepositoryToken(Flight),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    flightService = module.get<FlightsService>(FlightsService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(flightService).toBeDefined();
  });

  describe('find all', () => {
    it('should find all flights', async () => {
      const flights = [flight] as Flight[];

      jest.spyOn(repositoryMock, 'find').mockImplementation(() => flights);

      const result = await flightService.findAll();

      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).toBe(flights);
    });
  });

  describe('find by id', () => {
    it('should return a flight', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => flight);

      const result = await flightService.findById('1');

      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(flight);
    });

    it('should return null if flight not found', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);

      const result = await flightService.findById('7');

      expect(repositoryMock.findOne).toHaveBeenCalledWith('7');
      expect(result).toBe(null);
    });
  });

  describe('create', () => {
    it('should return created flight', async () => {
      jest.spyOn(repositoryMock, 'save').mockImplementation(() => flight);

      const result = await flightService.create(flight);

      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
      expect(repositoryMock.save).toHaveBeenCalledWith(flight);
      expect(result).toStrictEqual(flight);
    });
  });

  describe('update', () => {
    it('should return updated flight', async () => {
      jest.spyOn(repositoryMock, 'update').mockImplementation(() => flight);

      const result = await flightService.update(flight, '1');

      expect(repositoryMock.update).toHaveBeenCalledTimes(1);
      expect(repositoryMock.update).toHaveBeenCalledWith('1', flight);
      //expect(result).toStrictEqual(flight);
    });
  });

  describe('delete', () => {
    it('should return deleted when flight is deleted', async () => {
      jest.spyOn(repositoryMock, 'delete').mockImplementation(() => 'deleted');

      const result = await flightService.delete('1');

      expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(repositoryMock.delete).toHaveBeenCalledWith('1');
      expect(result).toBe('deleted');
    });
  });
});
