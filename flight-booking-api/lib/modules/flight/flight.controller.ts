import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'lib/utils/guards/admin.guard';
import { Flight } from './flight.entity';
import { FlightsService } from './flight.service';

@Controller('flights')
@UseGuards(AuthGuard('jwt'))
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @Get('/:id')
  getFlight(@Param('id') id: string) {
    return this.flightsService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() body: Flight) {
    return this.flightsService.create(body);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  update(@Body() body: Flight, @Param('id') id: string) {
    return this.flightsService.update(body, id);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.flightsService.delete(id);
  }
}
