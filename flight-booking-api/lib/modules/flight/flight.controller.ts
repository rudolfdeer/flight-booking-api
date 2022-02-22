import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Flight } from './flight.entity';
import { FlightsService } from './flight.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.flightsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  getFlight(@Param('id') id: string) {
    return this.flightsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: Flight, @Request() req) {
    return this.flightsService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  update(@Body() body: Flight, @Param('id') id: string) {
    return this.flightsService.update(body, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.flightsService.delete(id);
  }
}
