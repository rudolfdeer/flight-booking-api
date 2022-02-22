import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async findById(id: string | number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne(id);

    return ticket;
  }

  async getBookedTickets(userId: number) {
    const tickets = await this.ticketRepository.find({ profileId: userId });

    return tickets;
  }

  async bookTicket(ticketId: string, userId: number) {
    const ticket = await this.ticketRepository.findOne(ticketId);
    if (!ticket.isAvaliable) {
      return 'this ticket is already booked by other user';
    }

    await this.ticketRepository.update(ticketId, {
      profileId: userId,
      isAvaliable: false,
    });

    return this.findById(ticketId);
  }

  async deleteBookedTicket(ticketId: string, userId: number) {
    const ticket = await this.ticketRepository.findOne(ticketId);
    if (ticket.profileId !== userId) {
      return 'this ticket was booked by other user';
    }

    await this.ticketRepository.update(ticketId, {
      profileId: null,
      isAvaliable: true,
    });

    return this.findById(ticketId);
  }
}
