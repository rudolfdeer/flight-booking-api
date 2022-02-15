import { Module } from '@nestjs/common';
import { TicketsController } from './modules/ticket/ticket.controller';
import { TicketsService } from './modules/ticket/ticket.service';

@Module({
  imports: [],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class AppModule {}
