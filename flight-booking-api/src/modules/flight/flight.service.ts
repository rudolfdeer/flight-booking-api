import { Injectable } from '@nestjs/common';
import { Flight } from './flight.interface';

@Injectable()
export class FlightsService {
  private readonly flights: Flight[] = [];

  findAll() {
    //
  }
}
