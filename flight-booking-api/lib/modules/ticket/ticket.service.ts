import { Injectable } from '@nestjs/common';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [];

  findAll() {
    //
  }
}
