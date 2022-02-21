import { Controller, Get } from '@nestjs/common';

@Controller('flights')
export class FlightsController {
  @Get()
  findAll() {
    //
  }
}
