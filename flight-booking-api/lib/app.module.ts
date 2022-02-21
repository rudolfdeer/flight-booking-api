import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightModule } from './modules/flight/flight.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TicketModule } from './modules/ticket/ticket.module';
import "reflect-metadata";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ProfileModule,
    FlightModule,
    TicketModule,
  ],
})
export class AppModule {}
