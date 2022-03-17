import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
  ) {}

  async findAll() {
    const flights = await this.flightsRepository.find();

    return flights;
  }

  async findById(id: string) {
    const flight = await this.flightsRepository.findOne(id);

    if (!flight) {
      return null;
    }

    return flight;
  }

  async create(body: Flight) {
    const newFlight = { ...body };

    const flight = await this.flightsRepository.save(newFlight);

    return flight;
  }

  async update(body: Flight, id: string) {
    await this.flightsRepository.update(id, body);

    return this.findById(id);
  }

  async delete(id: string) {
    await this.flightsRepository.delete(id);

    return 'deleted';
  }
}
