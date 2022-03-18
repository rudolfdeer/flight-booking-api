import { FlightsController } from '../flight.controller';
import { FlightsService } from '../flight.service';
import { Flight } from '../flight.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForbiddenException, HttpException } from '@nestjs/common';
import { AdminGuard } from 'lib/utils/guards/admin.guard';

describe('flight controller', () => {
  let flightController: FlightsController;
  let flightService: FlightsService;
  let module: TestingModule;

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

  const id = '1';

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
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile();

    flightService = module.get<FlightsService>(FlightsService);
    flightController = module.get<FlightsController>(FlightsController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('find all', () => {
    it('should return an array of all flights', async () => {
      const result = [flight] as Flight[];

      jest
        .spyOn(flightService, 'findAll')
        .mockImplementation(async () => result);

      expect(await flightController.findAll()).toBe(result);
    });
  });

  describe('get flight', () => {
    it('should find a flight by id', async () => {
      const result = flight as Flight;

      jest
        .spyOn(flightService, 'findById')
        .mockImplementation(async () => result);

      expect(await flightController.getFlight(id)).toBe(result);
    });

    it('should return 404 error when no flight was found', async () => {
      jest
        .spyOn(flightService, 'findById')
        .mockImplementation(async () => null);

      try {
        await flightController.getFlight('1');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(404);
        expect(err.message).toBe('flight not found');
      }
    });
  });

  describe('create', () => {
    it('should apply admin guard', () => {
      const guards = Reflect.getMetadata('__guards__', flightController.create);
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(AdminGuard);
    });

    it('should return 403 error if not admin', async () => {
      const result = flight;
      const guards = Reflect.getMetadata('__guards__', flightController.create);
      const guard = new guards[0]();

      jest
        .spyOn(flightService, 'create')
        .mockImplementation(async () => guard.error);

      try {
        await flightController.create(result);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should return created flight', async () => {
      const result = flight as Flight;

      jest
        .spyOn(flightService, 'create')
        .mockImplementation(async () => result);

      const response = await flightController.create(result);

      expect(response).toBe(result);
      expect(response.id).toBeTruthy;
    });
  });

  describe('update', () => {
    it('should apply admin guard', () => {
      const guards = Reflect.getMetadata('__guards__', flightController.update);
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(AdminGuard);
    });

    it('should return 403 error if not admin', async () => {
      const result = flight;
      const guards = Reflect.getMetadata('__guards__', flightController.update);
      const guard = new guards[0]();

      jest
        .spyOn(flightService, 'update')
        .mockImplementation(async () => guard.error);

      try {
        await flightController.update(result, id);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should return updated flight', async () => {
      const result = flight;

      jest
        .spyOn(flightService, 'update')
        .mockImplementation(async () => result);

      const response = await flightController.update(result, id);

      expect(response).toBe(result);
      expect(response.id).toBe(1);
    });
  });

  describe('delete', () => {
    it('should apply admin guard', () => {
      const guards = Reflect.getMetadata('__guards__', flightController.delete);
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(AdminGuard);
    });

    it('should return -deleted-', async () => {
      const result = 'deleted';

      jest
        .spyOn(flightService, 'delete')
        .mockImplementation(async () => result);

      const response = await flightController.delete(id);

      expect(response).toBe(result);
    });
  })
});
