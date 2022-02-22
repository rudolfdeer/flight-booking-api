import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './ticket.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/booked')
  async getBookedTickets(@Request() req) {
    const userId = req.user.id;
    return this.ticketsService.getBookedTickets(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/booked/:id')
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/booked/:id')
  async bookTicket(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.ticketsService.bookTicket(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/booked/:id')
  async deleteBookedTicket(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.ticketsService.deleteBookedTicket(id, userId);
  }
}
