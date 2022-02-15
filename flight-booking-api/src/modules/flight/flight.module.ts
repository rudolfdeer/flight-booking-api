import { Module } from '@nestjs/common';
import { FlightsController } from './flight.controller';
import { FlightsService } from './flight.service';

@Module({
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightModule {}
