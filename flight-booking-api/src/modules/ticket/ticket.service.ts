import { Injectable } from '@nestjs/common';
import { Ticket } from './ticket.interface';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [];

  findAll() {
    //
  }
}
