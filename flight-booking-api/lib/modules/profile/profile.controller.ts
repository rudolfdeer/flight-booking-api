import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Profile } from './profile.entity';
import { ProfilesService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfilesService) {}

  @Post('/sign-up')
  async signUp(
    @Body() body: Profile,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.profileService.signUp(body);
    res.cookie('jwt', response.access_token);

    return response.user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  async signIn(@Request() req, @Res({ passthrough: true }) res: Response) {
    const response = await this.profileService.signIn(req.user);
    res.cookie('jwt', response.access_token);
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/sign-out')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return null;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Request() req, @Body() body: Profile) {
    const userId = req.user.id;
    return this.profileService.update(body, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteById(@Request() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.id;
    await this.profileService.deleteById(userId);
    res.clearCookie('jwt');
    return null;
  }
}
