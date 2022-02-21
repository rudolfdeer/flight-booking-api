import { Injectable } from '@nestjs/common';
import { Flight } from './flight.entity';



@Injectable()
export class FlightsService {
  private readonly flights: Flight[] = [];

  findAll() {
    //
  }
}
