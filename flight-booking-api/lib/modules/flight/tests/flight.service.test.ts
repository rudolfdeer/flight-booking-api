import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from '../flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from '../flight.entity';
import { FlightsController } from '../flight.controller';

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
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile();

    flightService = module.get<FlightsService>(FlightsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(flightService).toBeDefined();
  });
});