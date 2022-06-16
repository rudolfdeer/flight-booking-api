import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from 'lib/utils/decorators/userId.decorator';
import { TicketsService } from './ticket.service';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getBookedTickets(@UserId() userId: number) {
    return this.ticketsService.getBookedTickets(userId);
  }

  @Get('/:id')
  async getTicket(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Post('/:id')
  async bookTicket(@UserId() userId: number, @Param('id') id: string) {
    return this.ticketsService.bookTicket(id, userId);
  }

  @Delete('/:id')
  async deleteBookedTicket(@UserId() userId: number, @Param('id') id: string) {
    return this.ticketsService.deleteBookedTicket(id, userId);
  }
}
