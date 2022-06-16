import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'lib/utils/strategies/jwt.strategy';
import { TicketsController } from './ticket.controller';
import { Ticket } from './ticket.entity';
import { TicketsService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketsController],
  providers: [TicketsService, JwtStrategy],
})
export class TicketModule {}
