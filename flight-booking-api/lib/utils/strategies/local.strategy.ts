import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProfilesService } from 'lib/modules/profile/profile.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private profileService: ProfilesService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.profileService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}