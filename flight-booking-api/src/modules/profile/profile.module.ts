import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfilesService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfilesService],
})
export class ProfileModule {}
