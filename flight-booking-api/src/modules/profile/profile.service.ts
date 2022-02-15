import { Injectable } from '@nestjs/common';
import { Profile } from './profile.interface';

@Injectable()
export class ProfilesService {
  private readonly profiles: Profile[] = [];

  findAll() {
    //
  }
}
