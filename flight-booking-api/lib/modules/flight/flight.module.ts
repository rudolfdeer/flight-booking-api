import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'lib/utils/strategies/jwt.strategy';
import { FlightsController } from './flight.controller';
import { Flight } from './flight.entity';
import { FlightsService } from './flight.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flight])],
  controllers: [FlightsController],
  providers: [FlightsService, JwtStrategy],
})
export class FlightModule {}
