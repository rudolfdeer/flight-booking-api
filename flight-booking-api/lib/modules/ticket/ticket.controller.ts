import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from 'lib/utils/decorators/user.decorator';
import { TicketsService } from './ticket.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/booked')
  async getBookedTickets(@UserId() userId: number) {
    return this.ticketsService.getBookedTickets(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/booked/:id')
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/booked/:id')
  async bookTicket(@UserId() userId: number, @Param('id') id: string) {
    return this.ticketsService.bookTicket(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/booked/:id')
  async deleteBookedTicket(@UserId() userId: number, @Param('id') id: string) {
    return this.ticketsService.deleteBookedTicket(id, userId);
  }
}
