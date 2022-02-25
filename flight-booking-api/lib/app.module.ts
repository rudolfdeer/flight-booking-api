import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightModule } from './modules/flight/flight.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TicketModule } from './modules/ticket/ticket.module';
import 'reflect-metadata';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    ProfileModule,
    FlightModule,
    TicketModule,
  ],
})
export class AppModule {}
