import { Module } from '@nestjs/common';
import { TicketsController } from './ticket.controller';
import { TicketsService } from './ticket.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketModule {}
